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
import { Schema } from './schema.js'
import app from '@adonisjs/core/services/app'

const graphqlCore = await app.container.make('graphql')

export function getInputType(arg: {
  type: () => any
}): GraphQLNamedType | GraphQLNamedType[] | undefined {
  const getType = (inputType: any): GraphQLNamedType | undefined => {
    if (inputType instanceof GraphQLScalarType) {
      return inputType
    }

    switch (inputType.name) {
      case 'String':
        return GraphQLString
      case 'Number':
        return GraphQLInt
      case 'Boolean':
        return GraphQLBoolean
      default:
        return Schema.getType(inputType.__name__ || inputType.name)
    }
  }
  const type = arg.type()

  if (Array.isArray(type)) {
    return type.map(getType).filter((t): t is GraphQLNamedType => t !== undefined)
  }
  return getType(type)
}

export function getPropertyType(options: PropertyMetaOptions) {
  const definedType = getInputType(options)
  if (!definedType || (Array.isArray(definedType) && !definedType[0])) {
    return null
  }

  const namedType = Array.isArray(definedType) ? new GraphQLList(definedType[0]) : definedType
  return options.nullable ? namedType : new GraphQLNonNull(namedType)
}

export function createListType(type: GraphQLNamedType) {
  return new GraphQLList(type)
}

export function getParameters(parameters: ArgMetaOptions[], context: HttpContext, args: any = {}) {
  if (!parameters?.length) return []
  parameters.sort((a, b) => a.index - b.index)
  const res = parameters.map((param: any) => {
    if (param.name === 'context') {
      return graphqlCore.registeredFn.createContext(context)
    }
    return args[param.name] || param.defaultValue || undefined
  })
  return res
}
