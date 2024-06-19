import { ApiClient } from '@japa/api-client'

export async function sendGraphqlRequest(
  client: ApiClient,
  query: string,
  variables: Record<string, any> = {}
) {
  const response = await client.post('/graphql').json({ query, variables })
  response.assertStatus(200)
  return response
}
