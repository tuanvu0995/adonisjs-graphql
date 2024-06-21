import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Updating the "Accept" header to always accept "application/json" response
 * from the server. This will force the internals of the framework like
 * validator errors or auth errors to return a JSON response.
 */

declare module '@adonisjs/core/http' {
  export interface HttpContext {
    auth: {
      user: any
    }
  }
}

export default class FaceAuthMiddleware {
  async handle({ auth }: HttpContext, next: NextFn) {
    auth = {
      user: {
        id: 1,
        name: 'John Doe',
        email: 'johndoe@example.com',
      },
    }
    console.log('FaceAuthMiddleware:', auth.user.id)
    return next()
  }
}
