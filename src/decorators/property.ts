import { GraphQLString } from 'graphql'
import { BaseModel, belongsTo, column, hasMany, hasOne, manyToMany } from '@adonisjs/lucid/orm'
import { ColumnOptions } from '@adonisjs/lucid/types/model'
import stringHelpers from '@adonisjs/core/helpers/string'

import * as utils from '../utils.js'
import Metadata, { MetaKey } from '../metadata.js'
import { Nullable, PropertyRelation } from '../types.js'
import { DateTimeScalar } from '../scalars/index.js'

export type PropertyOptions = Omit<ColumnOptions, 'isPrimary' | 'columnName' | 'serializeAs'> & {
  type?: () => any
  nullable?: boolean | Nullable
  columnName?: string
  serializeAs?: string | null
  isPrimary?: boolean
  description?: string
  deprecationReason?: string
}

/**
 * @summary Decorator for defining a GraphQL property using Lucid ORM
 * @param options - Options for the property
 */
function Property(options?: PropertyOptions): PropertyDecorator & MethodDecorator {
  const defaultOptions: PropertyOptions = {
    type: () => GraphQLString,
    nullable: false,
    isPrimary: false,
    serializeAs: 'column',
    columnName: '',
  }
  return (target: object, propertyKey: string | symbol) => {
    /**
     * Lucid ORM column decorator
     */
    if (target instanceof BaseModel) {
      column({
        ...options,
        columnName: stringHelpers.snakeCase(propertyKey as string) as string,
      })(target, propertyKey)
    }

    /**
     * Metadata for the property
     */
    Metadata.for(target)
      .with(propertyKey)
      .set(MetaKey.Property, utils.merge(defaultOptions, options))
  }
}

export type DateTimePropertyOptions = PropertyOptions & {
  autoCreate?: boolean
  autoUpdate?: boolean
}

/**
 * @summary Decorator for defining a GraphQL property as a DateTime using Lucid ORM
 * @param options - Options for the property
 */
Property.dateTime = function (
  options?: DateTimePropertyOptions
): PropertyDecorator & MethodDecorator {
  const defaultOptions: PropertyOptions = {
    type: () => DateTimeScalar,
    nullable: false,
    isPrimary: false,
    serializeAs: 'column',
    columnName: '',
  }
  return (target: object, propertyKey: string | symbol) => {
    /**
     * Lucid ORM column decorator
     */
    if (target instanceof BaseModel) {
      column.dateTime({
        ...options,
        columnName: stringHelpers.snakeCase(propertyKey as string) as string,
      })(target as object, propertyKey as string)
    }

    /**
     * Metadata for the property
     */
    Metadata.for(target)
      .with(propertyKey)
      .set(MetaKey.Property, utils.merge(defaultOptions, options))
  }
}

/**
 * @summary Decorator for defining a GraphQL property as a resolver
 * @param returnType - The return type of the resolver
 */
Property.resolver = function (returnType: Function): MethodDecorator {
  return (target: object, propertyKey: string | symbol) => {
    Metadata.for(target).with(propertyKey).set(MetaKey.PropertyResolver, {
      isResolver: true,
      type: returnType,
    })
  }
}

/**
 * @summary Decorator for defining a has-many relation
 * @param type - The type of the relation
 * @param options - Options for the relation
 */
Property.hasMany = function (type: () => any, options?: any): PropertyDecorator {
  return (target: object, propertyKey: string | symbol) => {
    hasMany(type, options)(target as any, propertyKey as string)
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
Property.hasOne = function (type: () => any, options?: any): PropertyDecorator {
  return (target: object, propertyKey: string | symbol) => {
    hasOne(type, options)(target as any, propertyKey as string)
    Metadata.for(target)
      .with(propertyKey)
      .set(
        MetaKey.Property,
        utils.merge({
          ...options,
          relation: PropertyRelation.HasOne,
          nullable: true,
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
Property.belongsTo = function (type: () => any, options?: any): PropertyDecorator {
  return (target: object, propertyKey: string | symbol) => {
    belongsTo(type, options)(target as any, propertyKey as string)
    Metadata.for(target)
      .with(propertyKey)
      .set(
        MetaKey.Property,
        utils.merge({
          ...options,
          nullable: true,
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
Property.manyToMany = function (type: () => any, options?: any): PropertyDecorator {
  return (target: object, propertyKey: string | symbol) => {
    manyToMany(type, options)(target as any, propertyKey as string)
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

export { Property }
