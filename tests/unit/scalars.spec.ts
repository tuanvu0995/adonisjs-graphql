import { test } from '@japa/runner'
import { DateTimeScalar, parseValue, serialize } from '../../src/scalars/datetime.js'
import { registerEnumType } from '../../src/scalars/enum.js'

test.group('Scalars', () => {
  test('datetime scalar', async ({ assert }) => {
    assert.equal(DateTimeScalar.name, 'DateTime')
  })

  test('datetime parse value', async ({ assert }) => {
    const value = parseValue('2021-01-01T00:00:00.000Z')
    assert.isTrue(value.isValid)
  })

  test('datetime serialize', async ({ assert }) => {
    const value = serialize(DateTimeScalar.parseValue('2021-01-01'))
    assert.equal(value, '2021-01-01T00:00:00.000+00:00')
  })

  test('datetime serialize invalid', async ({ assert }) => {
    assert.throws(
      () => serialize(new Date()),
      'GraphQL Date Scalar serializer expected a `Date` object'
    )
  })
})

test.group('Emum', () => {
  test('throw error when enum is not an object', async ({ assert }) => {
    assert.throws(() => {
      registerEnumType('test', {
        name: 'Test',
      })
    }, 'Cannot register a non-object as enum')
  })

  test('throw error when enum is empty', async ({ assert }) => {
    assert.throws(() => {
      registerEnumType(
        {},
        {
          name: 'Test',
        }
      )
    }, 'Cannot register an empty object as enum')
  })

  test('throw error when enum has non-string values', async ({ assert }) => {
    assert.throws(() => {
      registerEnumType(
        {
          test: 1,
        },
        {
          name: 'Test',
        }
      )
    }, 'Cannot register an enum with non-string values')
  })

  test('register enum type', async ({ assert }) => {
    registerEnumType(
      {
        A: 'A',
        B: 'B',
      },
      {
        name: 'Test',
        valuesConfig: {
          A: {
            description: 'A description',
            deprecationReason: 'Use B instead',
          },
          B: {
            description: 'B description',
          },
        },
      }
    )

    assert.isTrue(true)
  })
})
