import { test } from '@japa/runner'
import * as utils from '../src/utils.js'

test.group('Utils', () => {
  test('isNil', ({ assert }) => {
    assert.isTrue(utils.isNil(null))
    assert.isTrue(utils.isNil(undefined))
    assert.isFalse(utils.isNil(0))
    assert.isFalse(utils.isNil(''))
  })

  test('merge', ({ assert }) => {
    assert.deepEqual(utils.merge({ a: 1 }, { b: 2 }), { a: 1, b: 2 })
    assert.deepEqual(utils.merge({ a: 1 }, { a: 2 }), { a: 2 })
  })

  test('merge with empty objects', ({ assert }) => {
    assert.deepEqual(utils.merge(), {})
  })

  test('merge with single object', ({ assert }) => {
    assert.deepEqual(utils.merge({ a: 1 }), { a: 1 })
  })

  test('defaultTo', ({ assert }) => {
    assert.equal(utils.defaultTo(null, 1), 1)
    assert.equal(utils.defaultTo(undefined, 1), 1)
    assert.equal(utils.defaultTo(0, 1), 0)
  })

  test('memoize', ({ assert }) => {
    const fn = (a: number, b: number) => a + b
    const memoized = utils.memoize(fn)

    assert.equal(memoized(1, 2), 3)
    assert.equal(memoized(1, 2), 3)
  })

  test('memoize with resolver', ({ assert }) => {
    const fn = (a: number, b: number) => a + b
    const memoized = utils.memoize(fn, (...args) => args.join('-'))

    assert.equal(memoized(1, 2), 3)
    assert.equal(memoized(1, 2), 3)
  })

  test('memoize throw error when func is not a function', ({ assert }) => {
    assert.throws(() => {
      utils.memoize(1 as any)
    }, TypeError)
  })

  test('memoize throw error when resolver is not a function', ({ assert }) => {
    assert.throws(() => {
      utils.memoize(() => {}, 1 as any)
    }, TypeError)
  })
})
