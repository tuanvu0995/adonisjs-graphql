import Metadata, { MetaKey } from '../metadata.js'

/**
 * @summary Decorator for defining a GraphQL query
 * @param returnType - The return type of the query
 */
export function Query(returnType: Function): MethodDecorator {
  return (target: object, propertyKey: string | symbol) => {
    Metadata.for(target).with(propertyKey).set(MetaKey.Query, {
      type: returnType,
    })
  }
}

/**
 * @summary Decorator for defining a GraphQL mutation
 * @param returnType - The return type of the mutation
 */
export function Mutation(returnType: Function): MethodDecorator {
  return (target: object, propertyKey: string | symbol) => {
    Metadata.for(target).with(propertyKey).set(MetaKey.Mutation, {
      type: returnType,
    })
  }
}
