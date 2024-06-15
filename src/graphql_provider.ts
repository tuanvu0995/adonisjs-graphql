import type { ApplicationService } from '@adonisjs/core/types'
import type { GraphqlCore } from './graphql_core.js'
import 'reflect-metadata'

declare module '@adonisjs/core/types' {
  export interface ContainerBindings {
    graphql: GraphqlCore
  }
}

export default class GraphqlProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {
    this.app.container.singleton('graphql', async (resolver) => {
      const { GraphqlCore } = await import('./graphql_core.js')
      const queueConfig = await resolver.make('config')
      const logger = await this.app.container.make('logger')
      return new GraphqlCore(queueConfig.get('graphql'), logger, this.app)
    })
  }

  /**
   * The container bindings have booted
   */
  async boot() {
    const graphqlCore = await this.app.container.make('graphql')
    await graphqlCore.boot()
  }

  async ready() {
    const graphqlCore = await this.app.container.make('graphql')
    await graphqlCore.ready()
  }

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {}
}
