import { test } from '@japa/runner'
import { inspect } from '../../src/inspect.js'

import User, { CreateUserInput } from '../../app/models/user.js'
import { MetaKey } from '../../src/metadata.js'
import UserResolver from '../../app/resolvers/user_resolver.js'

test.group('Inspect', () => {
  test('inspect definition properties', ({ assert }) => {
    const properties = inspect(User).getProperties()
    assert.isArray(properties)
    assert.lengthOf(properties, 10)
    assert.equal(
      properties.map((p) => p.name).join(','),
      'id,fullName,name,email,status,createdAt,updatedAt,posts,profile,avatar'
    )
  })

  test('inspect query properties', ({ assert }) => {
    const properties = inspect(UserResolver).queryProperties
    assert.isArray(properties)
    assert.lengthOf(properties, 3)
    assert.equal(properties.map((p) => p.name).join(','), 'users,user,userByEmail')
  })

  test('inspect mutation properties', ({ assert }) => {
    const properties = inspect(UserResolver).mutationProperties
    assert.isArray(properties)
    assert.lengthOf(properties, 2)
    assert.equal(properties.map((p) => p.name).join(','), 'createUser,updateUser')
  })

  test('inspect property resolver', ({ assert }) => {
    const properties = inspect(UserResolver).propertyResolvers
    assert.isArray(properties)
    assert.lengthOf(properties, 1)
    assert.equal(properties.map((p) => p.name).join(','), 'avatar')
  })

  test('inspect input properties', ({ assert }) => {
    const properties = inspect(CreateUserInput).inputProperties
    assert.isArray(properties)
    assert.lengthOf(properties, 3)
    assert.equal(properties.map((p) => p.name).join(','), 'name,email,password')
  })
})

test.group('HydratedProperty', () => {
  test('get hydrated property options', ({ assert }) => {
    const properties = inspect(User).getProperties()
    const property = properties[0]

    const options = property.get(MetaKey.Property)
    assert.equal(options.isPrimary, true)
    assert.equal(options.columnName, '')
    assert.equal(options.nullable, false)
    assert.equal(options.serializeAs, 'column')
    assert.isFunction(options.type)
  })
})
