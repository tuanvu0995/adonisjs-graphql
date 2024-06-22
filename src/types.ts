import { ApplicationService } from '@adonisjs/core/types'
import { GraphQLSchema } from 'graphql'

export type TargetClass = any
export type MetaValue = any

export enum PropertyRelation {
  HasOne = 'hasOne',
  HasMany = 'hasMany',
  BelongsTo = 'belongsTo',
  ManyToMany = 'manyToMany',
}

export enum Nullable {
  Items = 'items',
  List = 'list',
  ListAndItems = 'listAndItems',
}

/**
 * GraphQL types
 */
export type GraphQLConfig = {
  graphqlPath: string
  playground: boolean
  subscriptionEnabled?: boolean
  withServer?: (app: ApplicationService, schema: GraphQLSchema) => Promise<any>
  withPubSub?: (app: ApplicationService) => Promise<any>
}

/**
 * Metadata types
 */

export type CommonMetaOptions = {
  name: string
  description?: string
  deprecationReason?: string
  type: () => any
}

export type PropertyMetaOptions = CommonMetaOptions & {
  serializeAs?: string | null
  relation?: PropertyRelation
  nullable?: boolean | Nullable
  isResolver?: boolean
  definition?: any
}

export type QueryMetaOptions = CommonMetaOptions & {
  args?: any
  resolve: (...args: any[]) => Promise<any>
  topics?: string[]
}

export type ArgMetaOptions = CommonMetaOptions & {
  index: number
  nullable?: boolean | Nullable
  defaultValue?: any
}
