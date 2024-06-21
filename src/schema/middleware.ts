import type { HttpContext } from '@adonisjs/core/http'

export async function runMiddlewares(middlewares: any[], context: HttpContext, index = 0) {
  if (index < (middlewares || []).length) {
    const middleware = new middlewares[index]()
    await middleware.handle(
      context,
      async () => await runMiddlewares(middlewares, context, index + 1)
    )
  } else {
    return null
  }
}
