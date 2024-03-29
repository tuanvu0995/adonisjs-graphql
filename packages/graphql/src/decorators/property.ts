import { GraphQLString } from 'graphql'
import { column } from '@adonisjs/lucid/orm'
import { ColumnOptions } from '@adonisjs/lucid/types/model'
import stringHelpers from '@adonisjs/core/helpers/string'

import * as utils from '../utils.js'
import Metadata, { MetaKey } from '../metadata.js'
import { ISODateTime } from '../scalars/index.js'
import { Nullable } from '../types.js'

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
    column({
      ...options,
      columnName: stringHelpers.snakeCase(propertyKey as string) as string,
    })(target, propertyKey)

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
    type: () => ISODateTime,
    nullable: false,
    isPrimary: false,
    serializeAs: 'column',
    columnName: '',
  }
  return (target: object, propertyKey: string | symbol) => {
    /**
     * Lucid ORM column decorator
     */
    column.dateTime({
      ...options,
      columnName: stringHelpers.snakeCase(propertyKey as string) as string,
    })(target, propertyKey as string)

    /**
     * Metadata for the property
     */
    Metadata.for(target)
      .with(propertyKey)
      .set(MetaKey.Property, utils.merge(defaultOptions, options))
  }
}

export { Property }
