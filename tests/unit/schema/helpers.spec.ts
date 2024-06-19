import { test } from '@japa/runner'
import {
  createListType,
  getInputType,
  getPropretyType,
  getPrameters,
} from '../../../src/schema/helpers.js'
import { GraphQLList, GraphQLString } from 'graphql'
import { Int } from '../../../src/scalars/index.js'
import type { HttpContext } from '@adonisjs/core/http'

test.group('Helpers: getInputType', () => {
  test('return a String type', async ({ assert }) => {
    const type: any = getInputType({
      type: () => ({ name: 'String' }),
    })
    assert.notTypeOf(type, 'Array')
    assert.equal(type.name, 'String')
  })

  test('return a Number type', async ({ assert }) => {
    const type: any = getInputType({
      type: () => ({ name: 'Number' }),
    })
    assert.notTypeOf(type, 'Array')
    assert.equal(type.name, 'Int')
  })

  test('return a Boolean type', async ({ assert }) => {
    const type: any = getInputType({
      type: () => ({ name: 'Boolean' }),
    })
    assert.notTypeOf(type, 'Array')
    assert.equal(type.name, 'Boolean')
  })

  test('return a array of String type', async ({ assert }) => {
    const type: any = getInputType({
      type: () => [{ name: 'String' }],
    })
    assert.typeOf(type, 'Array')
    assert.equal(type[0].name, 'String')
  })
})

test.group('Helpers: getPropretyType', () => {
  test('return a NamedType', async ({ assert }) => {
    const type: any = getPropretyType({
      name: 'email',
      type: () => ({ name: 'String' }),
    })
    assert.equal(type.ofType.name, 'String')
  })

  test("return null if the type isn't found", async ({ assert }) => {
    const type: any = getPropretyType({
      name: 'email',
      type: () => ({ name: 'Unknown' }),
    })
    assert.isNull(type)
  })

  test("return null if the type isn't found", async ({ assert }) => {
    const type: any = getPropretyType({
      name: 'email',
      type: () => ({ name: 'Unknown' }),
    })
    assert.isNull(type)
  })
})

test.group('Helpers: getPrameters', () => {
  test('return a list of parameters', async ({ assert }) => {
    const context = {} as HttpContext
    const args = {
      page: 1,
    }
    const parameters = [
      {
        index: 0,
        name: 'limit',
        type: () => Int,
        defaultValue: 10,
      },
      {
        index: 1,
        name: 'page',
        type: () => Int,
      },
      {
        index: 2,
        name: 'context',
        type: () => context,
      },
      {
        index: 3,
        name: 'unknown',
        type: () => String,
      },
    ]
    const res = getPrameters(parameters, context, args)
    assert.deepEqual(res, [10, 1, {}, undefined])
  })
})

test('Helpers: createListType', async ({ assert }) => {
  const type = createListType(GraphQLString)
  assert.instanceOf(type, GraphQLList)
  assert.equal(type.ofType.name, 'String')
})
