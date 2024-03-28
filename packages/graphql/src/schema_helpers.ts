import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLScalarType,
  GraphQLString,
} from 'graphql'
import { PropertyMetaOptions } from './types.js'
import Schema from './schema.js'

export function getNamedType(name: string) {
  return Schema.getType(name)
}

export function getInputType(arg: { type: () => any; name?: string; index?: number }) {
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
        return getNamedType(inputType.name)
    }
  }
  return Array.isArray(type) ? type.map(getType) : getType(type)
}

export function getPropretyType(options: PropertyMetaOptions) {
  const definedType = getInputType(options)
  if (!definedType) {
    return null
  }
  const isArray = Array.isArray(definedType)
  const namedType = isArray ? definedType[0] : definedType
  const finalType = isArray ? new GraphQLList(namedType) : namedType

  return options.nullable ? finalType : new GraphQLNonNull(finalType)
}
