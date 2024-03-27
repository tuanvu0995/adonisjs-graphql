import Metadata, { MetaKey } from '../metadata.js'
import { Relation } from '../types.js'
import * as utils from '../utils.js'

export function HasMany(type: () => any, options?: any): PropertyDecorator {
  return (target: object, propertyKey: string | symbol) => {
    Metadata.for(target)
      .with(propertyKey)
      .set(
        MetaKey.Property,
        utils.merge({
          ...options,
          relation: Relation.HasMany,
          type,
        })
      )
  }
}
