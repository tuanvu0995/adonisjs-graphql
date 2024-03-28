export type TargetClass = any
export type MetaValue = any

export enum PropertyRelation {
  HasOne = 'hasOne',
  HasMany = 'hasMany',
  BelongsTo = 'belongsTo',
  ManyToMany = 'manyToMany',
}

/**
 * GraphQL types
 */
export type GraphQLConfig = {
  graphqlPath: string
  playground: boolean
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
  nullable?: boolean
  serializeAs?: string | null
  relation?: PropertyRelation
}

export type QueryMetaOptions = CommonMetaOptions & {
  args?: any
  resolve: (...args: any[]) => Promise<any>
}

export type ArgMetaOptions = CommonMetaOptions & {
  index: number
  nullable?: boolean
  defaultValue?: any
}
