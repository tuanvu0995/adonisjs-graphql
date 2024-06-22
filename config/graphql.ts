import { GraphQLSchema } from 'graphql'
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/lib/use/ws'
import { ApplicationService } from '@adonisjs/core/types'

import { defineConfig } from '../src/config.js'
import env from '../start/env.js'

const graphqlConfig = defineConfig({
  /**
   * The path to the GraphQL endpoint
   */
  graphqlPath: '/graphql',

  /**
   * Enable the GraphQL playground
   */
  playground: env.get('NODE_ENV') !== 'production',

  /**
   * Enable subscriptions
   */
  subscriptionEnabled: true,

  /**
   * Define the WS server for subscriptions
   */
  withServer: async (app: ApplicationService, schema: GraphQLSchema) => {
    const server = await app.container.make('server')
    const wsServer = new WebSocketServer({
      server: server.getNodeServer(),
      path: '/graphql',
    })
    wsServer.on('connection', (connect) => {
      console.log('WS connected')

      connect.on('close', (message) => {
        console.log('WS closed', message)
      })
    })
    return useServer({ schema }, wsServer)
  },
})

export default graphqlConfig
