import app from '@adonisjs/core/services/app'
import { HttpContext } from '@adonisjs/core/http'
import { GraphQLInputObjectType, GraphQLNamedType, GraphQLObjectType, GraphQLSchema } from 'graphql'
import { ArgMetaOptions, PropertyMetaOptions, QueryMetaOptions } from '../types.js'
import { getPrameters, getPropretyType } from './helpers.js'
import Metadata, { MetaKey } from '../metadata.js'
import { HydratedProperty, inspect } from '../inspect.js'
import { createRelation } from './create_relation.js'
import { createResolver } from './create_resolver.js'
import { createField } from './create_field.js'

export default class Schema {
  static schema: any = {
    query: null,
    mutation: null,
    types: [],
  }

  static getType(name: string): GraphQLNamedType | undefined {
    return this.schema.types.find((t: any) => t.name === name)
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

      // const subscriptions = inspect(definition).subscriptionProperties
      // const subscription = this.buildQuery(subscriptions, MetaKey.Subscription)
      // if (subscription) {
      //   this.schema.subscription = { ...this.schema.subscription, ...subscription }
      // }
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
          createResolver(acc, options, fieldType, property)
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
    const fields = queries.reduce((acc: Record<string, any>, query: HydratedProperty) => {
      const options: QueryMetaOptions = query.get(metaKey)

      const queryArgs: ArgMetaOptions[] = query.get(MetaKey.ParamTypes) || []
      const args = queryArgs.reduce((acc2: any, arg: ArgMetaOptions) => {
        const paramType = this.getOrCreateType(arg)
        acc2[arg.name] = { type: paramType }
        return acc2
      }, {})

      const outputType = this.getOrCreateType(options)

      acc[query.name] = {
        type: outputType,
        args,
        resolve: async (_: any, _args: any, context: HttpContext) => {
          const resolver = await app.container.make(query.definition)
          const parameters = getPrameters(queryArgs, context, _args)
          return resolver[options.resolve.name](...parameters)
        },
      }
      return acc
    }, {})
    return fields
  }
}
