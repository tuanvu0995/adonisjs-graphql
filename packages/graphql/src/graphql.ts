import fs from 'node:fs/promises'
import { GraphQLSchema, graphql } from 'graphql'
import { HttpContext } from '@adonisjs/core/http'
import { ApplicationService, LoggerService } from '@adonisjs/core/types'
import { GraphQLConfig } from './types.js'
import Schema from './schema.js'
import * as utils from './utils.js'

const DEFAULT_CONFIG: GraphQLConfig = {
  graphqlPath: '/graphql',
  playground: process.env.NODE_ENV !== 'production',
}

export class GraphqlCore {
  protected schema: GraphQLSchema | undefined

  protected pgHtml?: string

  constructor(
    private options: GraphQLConfig,
    private logger: LoggerService,
    private app: ApplicationService
  ) {
    this.options = utils.merge(DEFAULT_CONFIG, this.options)
  }

  async boot() {
    const router = await this.app.container.make('router')
    router.post(this.options.graphqlPath, this.handleRequest.bind(this))
    if (this.options?.playground) {
      this.logger.info('[GraphQL] Playground is enabled')
      router.get(this.options.graphqlPath, this.handlePlayground.bind(this))
    }

    this.buildSchema()
  }

  async buildSchema() {
    const { default: definitions } = await import(this.app.startPath('graphql.js'))
    if (!definitions?.length) {
      throw new Error('[GraphQL] definitions are missing')
    }
    this.schema = Schema.build(definitions)
  }

  async ready() {
    this.logger.info(`[GraphQL] server is up and running on path ${this.options.graphqlPath}`)
  }

  private async handleRequest(ctx: HttpContext) {
    const query = ctx.request.input('query')
    const variables = ctx.request.input('variables')

    const result = await graphql({
      schema: this.schema!,
      source: query,
      variableValues: variables,
      contextValue: ctx,
    })

    return ctx.response.json(result)
  }

  private async handlePlayground(ctx: HttpContext) {
    if (!this.pgHtml) {
      this.pgHtml = await fs.readFile(this.app.publicPath('playground.html'), 'utf-8')
    }
    return ctx.response.type('html').send(this.pgHtml)
  }
}
