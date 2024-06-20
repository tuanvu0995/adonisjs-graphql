export const CREATE_POST = `
mutation CreatePost($input: CreatePostInput!) {
  createPost(input: $input) {
    id
    userId
    title
    content
    createdAt
    updatedAt
  }
}
`
