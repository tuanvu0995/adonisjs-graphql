import { test } from '@japa/runner'
import * as helpers from '../../src/schema/helpers.js'
import { GraphQLString } from 'graphql'

test.group('Schema Helpers', () => {
  test('should be able to define a new type', ({ assert }) => {
    const type = helpers.getInputType({
      type: () => 'String',
    })

    assert.equal(type, GraphQLString)
  })
})
