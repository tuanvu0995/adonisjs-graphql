export type GraphQLConfig = {
  graphqlPath: string
  playground: boolean
}

export type QueryOptions = {
  args?: any
  return?: any
}

export type QueryMetaOptions = {
  args?: any
  type: () => any
  resolve: (...args: any[]) => Promise<any>
}

export type PropertyMetaOptions = {
  type: () => any
  nullable?: boolean
  serializeAs?: any
  relation?: Relation
}

export type ArgMetaOptions = {
  index: number
  name: string
  type: any
  nullable?: boolean
  defaultValue?: any
}

export enum Relation {
  HasOne = 'hasOne',
  HasMany = 'hasMany',
  BelongsTo = 'belongsTo',
  BelongsToMany = 'belongsToMany',
}
