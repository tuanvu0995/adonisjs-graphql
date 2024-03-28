import { GraphQLString } from 'graphql'
import Metadata, { MetaKey } from '../metadata.js'
import * as utils from '../utils.js'

export type FieldOptions = {
  type?: () => any
  nullable?: boolean
  description?: string
  deprecationReason?: string
}

export function Field(options?: FieldOptions): PropertyDecorator & MethodDecorator {
  const defaultOptions: FieldOptions = {
    type: () => GraphQLString,
    nullable: false,
  }
  return (target: object, propertyKey: string | symbol) => {
    Metadata.for(target)
      .with(propertyKey)
      .set(MetaKey.Property, utils.merge(defaultOptions, options))
  }
}
