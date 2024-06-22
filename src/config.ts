import { GraphQLConfig } from './types.js'
import * as utils from './utils.js'

const defaultConfig: GraphQLConfig = {
  graphqlPath: '/graphql',
  playground: process.env.NODE_ENV !== 'production',
  subscriptionEnabled: false,
  withPubSub: async () => {
    const { PubSub } = await import('graphql-subscriptions')
    return new PubSub()
  },
}

export function defineConfig(config: GraphQLConfig) {
  return utils.merge(defaultConfig, config)
}
