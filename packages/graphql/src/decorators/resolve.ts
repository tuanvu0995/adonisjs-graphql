import Metadata, { MetaKey } from '../metadata.js'

export function Query(returnType: Function): MethodDecorator {
  return (target: object, propertyKey: string | symbol) => {
    Metadata.for(target).with(propertyKey).set(MetaKey.Query, {
      type: returnType,
    })
  }
}

export function Mutation(returnType: Function): MethodDecorator {
  return (target: object, propertyKey: string | symbol) => {
    Metadata.for(target).with(propertyKey).set(MetaKey.Mutation, {
      type: returnType,
    })
  }
}
