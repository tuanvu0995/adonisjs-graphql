import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { ArgMetaOptions } from '../types.js'
import { MetaKey } from '../metadata.js'
import { getPrameters } from './helpers.js'

export function createFieldResolver(acc: any, options: any, fieldType: any, property: any) {
  const resolverArgs: ArgMetaOptions[] = property.get(MetaKey.ParamTypes)
  acc[property.name] = {
    type: fieldType,
    description: options.description,
    deprecationReason: options.deprecationReason,
    resolve: async (parent: any, _args: any, context: HttpContext) => {
      const resolver = await app.container.make(options.definition)
      const parameters = getPrameters(resolverArgs, context, {
        ..._args,
        parent,
      })
      return resolver[property.name](...parameters)
    },
  }
  return acc
}
