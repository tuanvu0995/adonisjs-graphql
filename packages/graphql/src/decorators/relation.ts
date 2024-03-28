import Metadata, { MetaKey } from '../metadata.js'
import { PropertyRelation } from '../types.js'
import * as utils from '../utils.js'

/**
 * @summary Decorator for defining a has-many relation
 * @param type - The type of the relation
 * @param options - Options for the relation
 */
export function HasMany(type: () => any, options?: any): PropertyDecorator {
  return (target: object, propertyKey: string | symbol) => {
    Metadata.for(target)
      .with(propertyKey)
      .set(
        MetaKey.Property,
        utils.merge({
          ...options,
          relation: PropertyRelation.HasMany,
          type,
        })
      )
  }
}

/**
 * @summary Decorator for defining a has-one relation
 * @param type - The type of the relation
 * @param options - Options for the relation
 */
export function HasOne(type: () => any, options?: any): PropertyDecorator {
  return (target: object, propertyKey: string | symbol) => {
    Metadata.for(target)
      .with(propertyKey)
      .set(
        MetaKey.Property,
        utils.merge({
          ...options,
          relation: PropertyRelation.HasOne,
          type,
        })
      )
  }
}

/**
 * @summary Decorator for defining a belongs-to relation
 * @param type - The type of the relation
 * @param options - Options for the relation
 */
export function BelongsTo(type: () => any, options?: any): PropertyDecorator {
  return (target: object, propertyKey: string | symbol) => {
    Metadata.for(target)
      .with(propertyKey)
      .set(
        MetaKey.Property,
        utils.merge({
          ...options,
          relation: PropertyRelation.BelongsTo,
          type,
        })
      )
  }
}

/**
 * @summary Decorator for defining a many-to-many relation
 * @param type - The type of the relation
 * @param options - Options for the relation
 * @returns - The decorated property
 */
export function ManyToMany(type: () => any, options?: any): PropertyDecorator {
  return (target: object, propertyKey: string | symbol) => {
    Metadata.for(target)
      .with(propertyKey)
      .set(
        MetaKey.Property,
        utils.merge({
          ...options,
          relation: PropertyRelation.ManyToMany,
          type,
        })
      )
  }
}
