import Metadata, { MetaKey } from '../metadata.js'
import { TargetClass } from '../types.js'

export type DefinitionOptions = {
  isInputType?: boolean
  isArgType?: boolean
  description?: string
}

export type Definition = new (...args: any[]) => any

/**
 * @summary Decorator for defining a class as a GraphQL type
 * @param options - Options for the definition
 * @returns
 */
export function Definition(options?: DefinitionOptions): ClassDecorator {
  return (target: TargetClass) => {
    Metadata.for(target).set(MetaKey.Definition, options)
  }
}

/**
 * @summary Decorator for defining a class as a GraphQL resolver
 * @param of - The type of the resolver
 */
export function Resolver(of: Function): ClassDecorator {
  return (target: TargetClass) => {
    Metadata.for(target).set(MetaKey.Definition, {
      isResolver: true,
      type: of,
    })
  }
}

type InputTypeOptions = {
  description?: string
}
/**
 * @summary Decorator for defining a class as a GraphQL input type
 * @param options - Options for the input type
 */
export function InputType(options?: InputTypeOptions): ClassDecorator {
  return (target: any) => {
    Definition({ ...options, isInputType: true })(target)
  }
}
