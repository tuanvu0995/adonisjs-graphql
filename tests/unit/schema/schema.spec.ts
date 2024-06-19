import { test } from '@japa/runner'

import { GraphQLObjectType } from 'graphql'
import Schema from '../../../src/schema/schema.js'
import { ID, String } from '../../../src/scalars/index.js'

class ExtendedSchema extends Schema {
  static schema: any = {
    query: null,
    mutation: null,
    types: [],
  }
}

test.group('Schema', () => {
  test('register type', ({ assert }) => {
    const type = new GraphQLObjectType({
      name: 'User',
      fields: {
        id: { type: ID },
        name: { type: String },
      },
    })
    ExtendedSchema.registerType(type)
    assert.deepEqual(ExtendedSchema.schema.types, [type])
  })

  test('register type with duplicate name', ({ assert }) => {
    const type = new GraphQLObjectType({
      name: 'User',
      fields: {
        id: { type: ID },
        name: { type: String },
      },
    })
    assert.throws(() => {
      ExtendedSchema.registerType(type)
    }, 'Type User is already registered')
  })

  test('get type', ({ assert }) => {
    const type = new GraphQLObjectType({
      name: 'Post',
      fields: {
        id: { type: ID },
        title: { type: String },
      },
    })
    ExtendedSchema.registerType(type)
    assert.deepEqual(ExtendedSchema.getType('Post'), type)
  })

  test('get type when type is missing', ({ assert }) => {
    assert.isUndefined(ExtendedSchema.getType('Member'))
  })
})
