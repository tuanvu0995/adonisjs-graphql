import {
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql'
import { HydratedProperty, inspect } from './inspect.js'
import Metadata, { MetaKey } from './metadata.js'
import { HttpContext } from '@adonisjs/core/http'
import { ArgMetaOptions, PropertyMetaOptions, QueryMetaOptions } from './types.js'
import { ApplicationService } from '@adonisjs/core/types'

export default class Schema {
  static schema: any = {
    query: null,
    mutation: null,
    types: [],
  }

  static build(app: ApplicationService, definitions: any[]) {
    for (const definition of definitions) {
      const type = this.buildType(definition)
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
      query: schema.query && new GraphQLObjectType({ name: 'QueryType', fields: schema.query }),
      mutation:
        schema.mutation &&
        new GraphQLObjectType({
          name: 'MutationType',
          fields: schema.mutation,
        }),
      subscription:
        schema.subscription &&
        new GraphQLObjectType({
          name: 'SubscriptionType',
          fields: schema.subscription,
        }),
      types: schema.types,
    })
  }

  private static getNamedType(name: string) {
    return this.schema.types.find((t: any) => t.name === name)
  }

  private static getInputType(arg: { type: () => any; name?: string; index?: number }) {
    if (!arg) return null

    const type = arg?.type()

    const getType = (inputType: any) => {
      if (type instanceof GraphQLScalarType) return type

      switch (inputType.name) {
        case 'String':
          return GraphQLString
        case 'Number':
          return GraphQLInt
        case 'Boolean':
          return GraphQLBoolean
        default:
          return this.getNamedType(inputType.name)
      }
    }
    return Array.isArray(type) ? type.map(getType) : getType(type)
  }

  private static getPropretyType(options: PropertyMetaOptions) {
    const definedType = this.getInputType(options)
    const isArray = Array.isArray(definedType)
    const namedType = isArray ? definedType[0] : definedType
    const finalType = isArray ? new GraphQLList(namedType) : namedType
    return options.nullable ? finalType : new GraphQLNonNull(finalType)
  }

  private static buildType(definition: any) {
    const properties = inspect(definition).getProperties(MetaKey.Property)
    if (properties.length === 0) return null

    // Build fields in the type
    const fields = properties.reduce((acc: any, property: any) => {
      const options: PropertyMetaOptions = property.get(MetaKey.Property)

      if (options.relation) {
        const fieldType = this.getPropretyType(options)
        acc[property.name] = {
          type: fieldType,
          resolve: async (parent: any, _args: any, _: HttpContext) => {
            return await parent.related(property.name).query().orderBy('id', 'asc')
          },
        }

        return acc
      }

      if (!options?.serializeAs === undefined || options?.serializeAs !== null) {
        const fieldType = this.getPropretyType(options)
        acc[property.name] = {
          type: fieldType,
        }
      }
      return acc
    }, {})

    const options = Metadata.for(definition).get(MetaKey.Definition)
    if (options?.isInputType) {
      return new GraphQLInputObjectType({
        name: definition.name,
        fields,
      })
    }
    return new GraphQLObjectType({
      name: definition.name,
      fields,
    })
  }

  private static buildQuery(
    app: ApplicationService,
    queries: any[],
    metaKey: MetaKey = MetaKey.Query
  ) {
    if (queries.length === 0) return null
    const fields = queries.reduce((acc: any, query: HydratedProperty) => {
      const options: QueryMetaOptions = query.get(metaKey)

      const queryArgs: ArgMetaOptions[] = query.get(MetaKey.ParamTypes) || []
      const args = queryArgs.reduce((acc2: any, arg: ArgMetaOptions) => {
        const inputType = this.getInputType(arg)
        const paramType = inputType || GraphQLString
        acc2[arg.name] = {
          type: arg.nullable ? paramType : new GraphQLNonNull(paramType),
        }
        return acc2
      }, {})

      const outputType = this.getPropretyType(options)

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
