export type CommonMetaOptions = {
  name: string
  type: () => any
}

export type PropertyMetaOptions = CommonMetaOptions & {
  nullable?: boolean
  serializeAs?: any
  relation?: PropertyRelation
}

export type QueryOptions = CommonMetaOptions & {
  args?: any
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

export enum PropertyRelation {
  HasOne = 'hasOne',
  HasMany = 'hasMany',
  BelongsTo = 'belongsTo',
  ManyToMany = 'manyToMany',
  HasManyThrough = 'hasManyThrough',
}

/**
 * GraphQL types
 */
export type GraphQLConfig = {
  graphqlPath: string
  playground: boolean
}
