import { GraphQLInputObjectType, GraphQLNamedType, GraphQLObjectType, GraphQLSchema } from 'graphql'
import { HttpContext } from '@adonisjs/core/http'
import { ArgMetaOptions, PropertyMetaOptions, PropertyRelation, QueryMetaOptions } from './types.js'
import { ApplicationService } from '@adonisjs/core/types'
import { getPropretyType } from './schema_helpers.js'
import Metadata, { MetaKey } from './metadata.js'
import { HydratedProperty, inspect } from './inspect.js'

export default class Schema {
  static schema: any = {
    query: null,
    mutation: null,
    types: [],
  }

  static getType(name: string): GraphQLNamedType | undefined {
    return this.schema.types.find((t: any) => t.name === name)
  }

  static build(app: ApplicationService, definitions: any[]) {
    for (const definition of definitions) {
      const type = this.buildTypes(definition)
      if (type) {
        this.schema.types.push(type)
      }
    }

    for (const definition of definitions) {
      const queries = inspect(definition).queryProperties
      const query = this.buildQuery(app, queries, MetaKey.Query)
      if (query) {
        this.schema.query = { ...this.schema.query, ...query }
      }

      const mutations = inspect(definition).mutationProperties
      const mutation = this.buildQuery(app, mutations, MetaKey.Mutation)
      if (mutation) {
        this.schema.mutation = { ...this.schema.mutation, ...mutation }
      }

      const subscriptions = inspect(definition).subscriptionProperties
      const subscription = this.buildQuery(app, subscriptions, MetaKey.Subscription)
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

  protected static getGetOrCreateType(options: PropertyMetaOptions) {
    const type = getPropretyType(options)
    if (type) return type
    const definition = options.type()
    return this.buildTypes(definition)
  }

  protected static buildTypes(definition: any) {
    const properties = inspect(definition).getProperties(MetaKey.Property)
    if (!Array.isArray(properties) || properties.length === 0) {
      return null
    }

    const fields = () => {
      return properties.reduce((acc: any, property: HydratedProperty) => {
        const options: PropertyMetaOptions = property.get(MetaKey.Property)
        const fieldType = this.getGetOrCreateType(options)

        /**
         * Create a field resolver when the property has a relation
         */
        if (options.relation) {
          acc[property.name] = {
            type: fieldType,
            description: options.description,
            deprecationReason: options.deprecationReason,
            resolve: async (parent: any, _args: any, _: HttpContext) => {
              if (
                [
                  PropertyRelation.HasMany,
                  PropertyRelation.ManyToMany,
                  PropertyRelation.HasOne,
                ].includes(options.relation!)
              ) {
                return await parent.related(property.name).query().orderBy('id', 'asc')
              }
              return await parent.related(property.name).query().first()
            },
          }
          return acc
        }

        // Will create the field type when serializeAs = null
        if (options?.serializeAs !== undefined || options?.serializeAs !== null) {
          acc[property.name] = {
            type: fieldType,
            description: options.description,
            deprecationReason: options.deprecationReason,
          }
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

  private static buildQuery(
    app: ApplicationService,
    queries: HydratedProperty[],
    metaKey: MetaKey = MetaKey.Query
  ) {
    if (queries.length === 0) return null
    const fields = queries.reduce((acc: any, query: HydratedProperty) => {
      const options: QueryMetaOptions = query.get(metaKey)

      const queryArgs: ArgMetaOptions[] = query.get(MetaKey.ParamTypes) || []
      const args = queryArgs.reduce((acc2: any, arg: ArgMetaOptions) => {
        const paramType = this.getGetOrCreateType(arg)
        acc2[arg.name] = { type: paramType }
        return acc2
      }, {})

      const outputType = this.getGetOrCreateType(options)

      acc[query.name] = {
        type: outputType,
        args,
        resolve: async (_: any, _args: any, context: HttpContext) => {
          const resolver = await app.container.make(query.definition)
          const parameters = this.getPrameters(query, context, _args)
          return await resolver[options.resolve.name](...parameters)
        },
      }
      return acc
    }, {})
    return fields
  }

  private static getPrameters(query: any, context: HttpContext, args: any) {
    const parameters = (query.get(MetaKey.ParamTypes) || []).sort(
      (a: any, b: any) => a.index - b.index
    )

    return parameters.map((param: any) => {
      if (!param.name) return args
      if (param.name === 'context') {
        return context
      }
      return (args || {})[param.name] || param.defaultValue
    })
  }
}
