import fs from 'node:fs/promises'
import { GraphQLSchema, graphql } from 'graphql'
import type { HttpContext } from '@adonisjs/core/http'
import { ApplicationService, LoggerService } from '@adonisjs/core/types'
import { GraphQLConfig } from './types.js'
import Schema from './schema/schema.js'
import * as utils from './utils.js'
import { DateTimeScalar } from './scalars/index.js'

export class GraphqlCore {
  protected schema: GraphQLSchema | undefined

  protected pgHtml: string | undefined
  protected wsServer: any
  protected pubsub: any

  constructor(
    private options: GraphQLConfig,
    private logger: LoggerService,
    private app: ApplicationService
  ) {}

  getPubSub() {
    if (!this.pubsub && this.options.subscriptionEnabled) {
      throw new Error('PubSub is not initialized')
    }
    return this.pubsub
  }

  async boot() {
    /**
     * Build the GraphQL schema
     */
    await this.buildSchema()

    /**
     * Register graphql request handler
     */
    const router = await this.app.container.make('router')
    router.post(this.options.graphqlPath, this.handleRequest.bind(this))

    /**
     * Register graphql playground
     */
    if (this.options?.playground) {
      this.logger.info('[GraphQL] Playground is enabled')
      router.get(this.options.graphqlPath, this.handlePlayground.bind(this))
    }

    /**
     * Enable subscriptions server
     */
    if (this.options?.subscriptionEnabled) {
      if (!this.options.withPubSub) {
        throw new Error('Missing "withPubSub" method to enable subscriptions')
      }
      this.app.ready(async () => {
        if (!this.options.withServer) {
          throw new Error('Missing "withServer" method to enable subscriptions')
        }
        this.wsServer = await this.options.withServer(this.app, this.schema!)
        this.logger.info('[GraphQL] Subscriptions are enabled')
      })
    }

    if (this.options?.subscriptionEnabled && this.options.withPubSub) {
      this.pubsub = await this.options.withPubSub(this.app)
    }
  }

  async ready() {
    this.logger.info(`[GraphQL] server is up and running on path ${this.options.graphqlPath}`)
  }

  async shutdown() {
    if (this.wsServer) {
      this.logger.info('[GraphQL] Closing subscriptions server')
      this.wsServer.dispose()
    }
  }

  async buildSchema() {
    const definitions = await this.loadDefinitions()
    this.schema = Schema.build(definitions)
  }

  private async loadDefinitions() {
    const appPath = this.app.makePath('app')
    let files = await fs.readdir(this.app.makePath('app'), { recursive: true })
    files = files.filter((file) => file.endsWith('.ts'))

    const definitions = await Promise.all(
      files.map(async (file) => await import(`${appPath}/${file}`))
    ).then((modules) =>
      modules
        .map((module) => Object.values(module).filter((value) => utils.isConstructor(value)))
        .flat()
    )

    return definitions
  }

  private async handleRequest(ctx: HttpContext) {
    const query = ctx.request.input('query')
    const variables = ctx.request.input('variables')
    const result = await graphql({
      schema: this.schema!,
      source: query,
      variableValues: variables,
      contextValue: ctx,
      typeResolver: {
        // @ts-ignore
        DateTime: DateTimeScalar,
      },
    }).catch((error) => console.error(error))
    return ctx.response.json(result)
  }

  private async handlePlayground(ctx: HttpContext) {
    if (!this.pgHtml) {
      const providerPath = this.app.publicPath('playground.html')
      this.pgHtml = await fs.readFile(providerPath, 'utf-8')
    }
    return ctx.response.type('html').send(this.pgHtml)
  }
}
