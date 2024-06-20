import { GraphQLObjectType } from 'graphql'
import Metadata, { MetaKey } from '../metadata.js'
import { Nullable } from '../types.js'

type ArgOptions = {
  nullable?: boolean | Nullable
  defaultValue?: any
  type?: () => any
}

/**
 * @summary Decorator for defining a GraphQL argument
 * @param name - The name of the argument
 * @param options - Options for the argument
 */
export function Arg(name: string, options?: ArgOptions) {
  return (target: any, propertyKey: string, parameterIndex: number) => {
    const paramTypes = Reflect.getOwnMetadata(MetaKey.ParamTypes, target, propertyKey)
    Metadata.for(target)
      .with(propertyKey)
      .set(MetaKey.ParamTypes, {
        index: parameterIndex,
        name,
        type: options?.type ? options.type : () => paramTypes[parameterIndex],
        nullable: options?.nullable,
        defaultValue: options?.defaultValue,
      })
  }
}

export type ArgsOptions = {
  [key: string]: any
}

/**
 * @summary Decorator for defining a GraphQL arguments object
 */
export function Args(defaultValues?: ArgsOptions) {
  return (target: any, propertyKey: string, parameterIndex: number) => {
    const paramTypes = Reflect.getOwnMetadata(MetaKey.ParamTypes, target, propertyKey)
    Metadata.for(target)
      .with(propertyKey)
      .set(MetaKey.ParamTypes, {
        index: parameterIndex,
        name: 'args',
        defaultValues,
        /* c8 ignore next */
        type: () => paramTypes[parameterIndex],
      })
  }
}

/**
 * @summary Decorator for defining a GraphQL context argument
 */
export function Context() {
  return (target: any, propertyKey: string, parameterIndex: number) => {
    Metadata.for(target)
      .with(propertyKey)
      .set(MetaKey.ParamTypes, {
        index: parameterIndex,
        name: 'context',
        /* c8 ignore next */
        type: () => GraphQLObjectType,
      })
  }
}

export function Parent(type?: Function) {
  return (target: any, propertyKey: string, parameterIndex: number) => {
    const paramTypes = Reflect.getOwnMetadata(MetaKey.ParamTypes, target, propertyKey)
    Metadata.for(target)
      .with(propertyKey)
      .set(MetaKey.ParamTypes, {
        index: parameterIndex,
        name: 'parent',
        /* c8 ignore next */
        type: () => type || paramTypes[parameterIndex],
      })
  }
}
