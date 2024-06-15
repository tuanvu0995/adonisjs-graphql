import { GraphQLEnumType, GraphQLEnumValueConfigMap } from 'graphql'
import Schema from '../schema/schema.js'

export function registerEnumType(
  enumObj: any,
  options: {
    name: string
    description?: string
    valuesConfig?: Record<string, { description?: string; deprecationReason?: string }>
  }
): void {
  const values = Object.values(enumObj) as string[]
  if (values.length === 0) {
    throw new Error('Cannot register an empty object as enum')
  }

  if (values.some((value) => typeof value !== 'string')) {
    throw new Error('Cannot register an enum with non-string values')
  }

  const valuesMap = values.reduce((acc: GraphQLEnumValueConfigMap, key: string) => {
    acc[key] = {
      value: key,
      description: options.valuesConfig?.[key]?.description,
      deprecationReason: options.valuesConfig?.[key]?.deprecationReason,
    }
    return acc
  }, {} as GraphQLEnumValueConfigMap)

  const type = new GraphQLEnumType({
    name: options.name,
    description: options.description,
    values: valuesMap,
  })

  /**
   * This is a hacky way to set the name of the enum to easy to find it later
   */
  enumObj.__name__ = options.name

  Schema.registerType(type)
}
