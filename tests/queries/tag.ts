export const CREATE_TAG = `
mutation CreateTag($input: CreateTagInput!) {
  createTag(input: $input) {
    id
    name
    slug
    description
  }
}
`
