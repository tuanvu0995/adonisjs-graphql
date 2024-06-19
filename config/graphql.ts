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
})

export default graphqlConfig
