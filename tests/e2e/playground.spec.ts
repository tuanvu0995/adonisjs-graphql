import { test } from '@japa/runner'

test.group('Playground', () => {
  test('test playground', async ({ client }) => {
    const response = await client.get('/graphql')

    response.assertStatus(200)
    response.assertTextIncludes('GraphQL Playground')
  })
})
