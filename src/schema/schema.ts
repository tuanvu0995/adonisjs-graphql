import { GraphQLInputObjectType, GraphQLNamedType, GraphQLObjectType, GraphQLSchema } from 'graphql'
import { ArgMetaOptions, PropertyMetaOptions, QueryMetaOptions } from '../types.js'
import { getPropretyType } from './helpers.js'
import Metadata, { MetaKey } from '../metadata.js'
import { HydratedProperty, inspect } from '../inspect.js'
import { createRelation } from './create_relation.js'
import { createFieldResolver } from './create_field_resolver.js'
import { createField } from './create_field.js'
import { createResolver } from './create_resolver.js'
import pubsub from '../services/pubsub/main.js'

export default class Schema {
  static schema: any = {
    query: null,
    mutation: null,
    types: [],
  }

  static getType(name: string): GraphQLNamedType | undefined {
    return this.schema.types.find((t: any) => t.name === name)
  }

  static registerType(type: GraphQLNamedType) {
    if (this.getType(type.name)) {
      throw new Error(`Type ${type.name} is already registered`)
    }
    this.schema.types.push(type)
  }

  /**
   * Build the schema from the definitions
   */
  static build(_definitions: any[]) {
    /**
     * Filter out definitions that don't have metadata
     */
    const definitions = _definitions.filter((def) => Metadata.for(def).exists())

    this.prepare(definitions)

    /**
     * Build all types from the definitions
     */
    for (const definition of definitions) {
      const type = this.buildTypes(definition)
      if (type) {
        this.schema.types.push(type)
      }
    }

    /**
     * Build queries, mutations and subscriptions
     */
    for (const definition of definitions) {
      const queries = inspect(definition).queryProperties
      const query = this.buildQuery(queries, MetaKey.Query)
      if (query) {
        this.schema.query = { ...this.schema.query, ...query }
      }

      const mutations = inspect(definition).mutationProperties
      const mutation = this.buildQuery(mutations, MetaKey.Mutation)
      if (mutation) {
        this.schema.mutation = { ...this.schema.mutation, ...mutation }
      }

      const subscriptions = inspect(definition).subscriptionProperties
      const subscription = this.buildQuery(subscriptions, MetaKey.Subscription)
      if (subscription) {
        this.schema.subscription = { ...this.schema.subscription, ...subscription }
      }
    }

    return this.buildSchema(this.schema)
  }

  private static buildSchema(schema: any) {
    return new GraphQLSchema({
      query: schema.query && new GraphQLObjectType({ name: 'Query', fields: schema.query }),
      mutation:
        schema.mutation &&
        new GraphQLObjectType({
          name: 'Mutation',
          fields: schema.mutation,
        }),
      subscription:
        schema.subscription &&
        new GraphQLObjectType({
          name: 'Subscription',
          fields: schema.subscription,
        }),
      types: schema.types,
    })
  }

  protected static getOrCreateType(options: PropertyMetaOptions) {
    const type = getPropretyType(options)
    if (type) return type
    const definition = options.type()
    return this.buildTypes(definition)
  }

  protected static prepare(definitions: any[]) {
    for (const def of definitions) {
      const defOptions = Metadata.for(def).get(MetaKey.Definition)
      if (!defOptions || !defOptions?.isResolver) continue

      /**
       * Get all properties of the resolver and set them as properties
       */
      const ofType = defOptions.type()
      const properties = inspect(def).getProperties(MetaKey.PropertyResolver) as any
      for (const property of properties) {
        const options: PropertyMetaOptions = property.get(MetaKey.PropertyResolver)
        Metadata.for(ofType)
          .with(property.name)
          .set(MetaKey.Property, {
            ...options,
            definition: def,
          })

        /**
         * Set the parameters of the resolver as parameters of the property
         */
        const parameters = property.get(MetaKey.ParamTypes)
        parameters.forEach((param: ArgMetaOptions) => {
          Metadata.for(ofType).with(property.name).set(MetaKey.ParamTypes, param)
        })
      }
    }
  }

  protected static buildTypes(definition: any) {
    const properties = inspect(definition).getProperties(MetaKey.Property)
    if (!Array.isArray(properties) || properties.length === 0) {
      return null
    }
    const fields = () => {
      return properties.reduce((acc: Record<string, any>, property: HydratedProperty) => {
        const options: PropertyMetaOptions = property.get(MetaKey.Property)
        const fieldType = this.getOrCreateType(options)

        /**
         * Create a field resolver when the property has a relation
         */
        if (options.relation) {
          createRelation(acc, options, fieldType, property)
          return acc
        }

        /**
         * Create a field resolver when the property is a resolver
         */
        if (options.isResolver) {
          createFieldResolver(acc, options, fieldType, property)
          return acc
        }

        // Will create the field type when serializeAs = null
        if (options?.serializeAs !== undefined || options?.serializeAs !== null) {
          createField(acc, options, fieldType, property)
        }

        return acc
      }, {})
    }

    const options = Metadata.for(definition).get(MetaKey.Definition)
    const typeOptions = {
      name: definition.name,
      fields,
      description: options?.description,
    }
    return options?.isInputType
      ? new GraphQLInputObjectType(typeOptions)
      : new GraphQLObjectType(typeOptions)
  }

  private static buildQuery(queries: HydratedProperty[], metaKey: MetaKey = MetaKey.Query) {
    if (!queries.length) return null
    const accepetedQueries = queries.filter((query) => {
      const options = Metadata.for(query.definition).get(MetaKey.Definition)
      return options.isResolver
    })

    const fields = accepetedQueries.reduce((acc: Record<string, any>, query: HydratedProperty) => {
      const options: QueryMetaOptions = query.get(metaKey)
      const middlewares = query.get(MetaKey.Middleware)

      const internalArgNames = ['context']

      const queryArgs: ArgMetaOptions[] = query.get(MetaKey.ParamTypes) || []
      const internalArgs = queryArgs.filter((arg) => internalArgNames.includes(arg.name))
      const externalArgs = queryArgs.filter((arg) => !internalArgNames.includes(arg.name))

      const args = externalArgs.reduce((acc2: any, arg: ArgMetaOptions) => {
        const paramType = this.getOrCreateType(arg)
        acc2[arg.name] = { type: paramType }
        return acc2
      }, {})

      const outputType = this.getOrCreateType(options)
      const object: any = {
        type: outputType,
        args,
      }

      if (metaKey === MetaKey.Subscription) {
        object.subscribe = () => pubsub.asyncIterator(options.topics!)
        object.resolve = async (payload: any, variables: any) => {
          return await options.resolve(payload, variables)
        }
      } else {
        object.resolve = createResolver({
          query,
          options,
          externalArgs,
          internalArgs,
          middlewares,
        })
      }
      acc[query.name] = object

      return acc
    }, {})
    return fields
  }
}
