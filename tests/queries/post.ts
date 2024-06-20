export const CREATE_POST = `
mutation CreatePost($input: CreatePostInput!) {
  createPost(input: $input) {
    id
    title
    content
    createdAt
    updatedAt
  }
}
`

export const GET_POST_WITH_AUTHOR = `
query GetPost($id: ID!) {
  post(id: $id) {
    id
    title
    content
    createdAt
    updatedAt
    user {
      id
      name
    }
  }
}
`
export const GET_POST_WITH_TAGS = `
query GetPost($id: ID!) {
  post(id: $id) {
    id
    title
    tags {
      id
      name
      slug
    }
  }
}
`
