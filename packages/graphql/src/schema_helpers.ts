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

export function getInputType(arg: { type: () => any }) {
  const getType = (inputType: any) => {
    if (inputType instanceof GraphQLScalarType) return inputType

    switch (inputType.name) {
      case 'String':
        return GraphQLString
      case 'Number':
        return GraphQLInt
      case 'Boolean':
        return GraphQLBoolean
      default:
        return Schema.getType(inputType.name)
    }
  }
  const type = arg.type()
  return Array.isArray(type) ? type.map(getType) : getType(type)
}

export function getPropretyType(options: PropertyMetaOptions) {
  const definedType = getInputType(options)
  if (!definedType) return null
  const isArray = Array.isArray(definedType)
  const namedType = isArray ? definedType[0] : definedType
  if (!namedType) return null
  const finalType = isArray ? new GraphQLList(namedType) : namedType
  return options.nullable ? finalType : new GraphQLNonNull(finalType)
}
