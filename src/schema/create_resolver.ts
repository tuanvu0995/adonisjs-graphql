import type { HttpContext } from '@adonisjs/core/http'
import { runMiddlewares } from './middleware.js'
import { getPrameters } from './helpers.js'
import logger from '@adonisjs/core/services/logger'
import app from '@adonisjs/core/services/app'
import { HydratedProperty } from '../inspect.js'
import { ArgMetaOptions } from '../types.js'

export function createResolver({
  query,
  options,
  externalArgs = [],
  internalArgs = [],
  middlewares = [],
}: {
  query: HydratedProperty
  options: any
  externalArgs?: ArgMetaOptions[]
  internalArgs?: ArgMetaOptions[]
  middlewares?: { middleware: any }[]
}) {
  return async (_: any, _args: any, context: HttpContext) => {
    try {
      if (middlewares?.length) {
        await runMiddlewares(middlewares, context)
      }

      const resolver = await app.container.make(query.definition)
      const parameters = getPrameters([...externalArgs, ...internalArgs], context, _args)
      return resolver[options.resolve.name](...parameters)
    } catch (error) {
      logger.error(error)
      throw error
    }
  }
}
