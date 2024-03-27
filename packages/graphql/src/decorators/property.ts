import * as utils from '../utils.js'
import { GraphQLString } from 'graphql'
import Metadata, { MetaKey } from '../metadata.js'
import { column } from '@adonisjs/lucid/orm'
import { ColumnOptions } from '@adonisjs/lucid/types/model'
import stringHelpers from '@adonisjs/core/helpers/string'
import { ISODateTime } from '../scalars/index.js'

export type PropertyOptions = Omit<ColumnOptions, 'isPrimary' | 'columnName' | 'serializeAs'> & {
  type?: () => any
  nullable?: boolean
  columnName?: string
  serializeAs?: string | null
  isPrimary?: boolean
}

function Property(options?: PropertyOptions): PropertyDecorator & MethodDecorator {
  const defaultOptions: PropertyOptions = {
    type: () => GraphQLString,
    nullable: false,
    isPrimary: false,
    serializeAs: 'column',
    columnName: '',
  }
  return (target: object, propertyKey: string | symbol) => {
    column({
      ...options,
      columnName: stringHelpers.snakeCase(propertyKey as string) as string,
    })(target, propertyKey)
    Metadata.for(target)
      .with(propertyKey)
      .set(MetaKey.Property, utils.merge(defaultOptions, options))
  }
}

export type PropertyDateTimeOptions = PropertyOptions & {
  autoCreate?: boolean
  autoUpdate?: boolean
}

Property.dateTime = function (
  options?: PropertyDateTimeOptions
): PropertyDecorator & MethodDecorator {
  const defaultOptions: PropertyOptions = {
    type: () => ISODateTime,
    nullable: false,
    isPrimary: false,
    serializeAs: 'column',
    columnName: '',
  }
  return (target: object, propertyKey: string | symbol) => {
    column.dateTime({
      ...options,
      columnName: stringHelpers.snakeCase(propertyKey as string) as string,
    })(target, propertyKey as string)
    Metadata.for(target)
      .with(propertyKey)
      .set(MetaKey.Property, utils.merge(defaultOptions, options))
  }
}

export { Property }
