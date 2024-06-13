import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
  GraphQLNamedType,
  GraphQLNonNull,
  GraphQLScalarType,
  GraphQLString,
} from 'graphql'
import { HttpContext } from '@adonisjs/core/http'
import { ArgMetaOptions, PropertyMetaOptions } from '../types.js'
import Schema from './schema.js'

export function getInputType(arg: {
  type: () => any
}): GraphQLNamedType | GraphQLNamedType[] | undefined | [] {
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
  const type = arg.type() as any | any[]

  if (Array.isArray(type)) {
    return type.map(getType).filter((t) => typeof t !== 'undefined') as any
  }
  return getType(type)
}

export function getPropretyType(options: PropertyMetaOptions) {
  const definedType = getInputType(options)
  const isListType = Array.isArray(definedType)
  if (!definedType || (isListType && !definedType[0])) {
    return null
  }

  const namedType = isListType ? new GraphQLList(definedType[0]) : definedType
  if (!namedType) return null

  return options.nullable ? namedType : new GraphQLNonNull(namedType)
}

export function createListType(type: GraphQLNamedType) {
  return new GraphQLList(type)
}

export function getPrameters(parameters: ArgMetaOptions[], context: HttpContext, args: any) {
  parameters.sort((a, b) => a.index - b.index)
  const res = parameters.map((param: any) => {
    if (!param.name) return args
    if (param.name === 'context') {
      return context
    }
    return (args || {})[param.name] || param.defaultValue || undefined
  })
  return res
}
