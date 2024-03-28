import Metadata, { MetaKey } from '../metadata.js'
import { PropertyRelation } from '../types.js'
import * as utils from '../utils.js'

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

export function HasManyThrough(type: () => any, options?: any): PropertyDecorator {
  return (target: object, propertyKey: string | symbol) => {
    Metadata.for(target)
      .with(propertyKey)
      .set(
        MetaKey.Property,
        utils.merge({
          ...options,
          relation: PropertyRelation.HasManyThrough,
          type,
        })
      )
  }
}
