import { GraphQLConfig } from './types.js'
import * as utils from './utils.js'

const defaultConfig: GraphQLConfig = {
  graphqlPath: '/graphql',
  playground: process.env.NODE_ENV !== 'production',
}

export function defineConfig(config: GraphQLConfig) {
  return utils.merge(defaultConfig, config)
}
