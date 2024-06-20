export const CREATE_USER = `
mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    email
    name
    status
    createdAt
    updatedAt
  }
}
`

export const UPDATE_USER = `
mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
  updateUser(id: $id, input: $input) {
    id
    name
  }
}
`

export const GET_USER = `
query GetUser($id: ID!) {
  user(id: $id) {
    id
    email
    name
    avatar
  }
}
`

export const GET_USER_WITH_POSTS = `
query GetUserWithPosts($id: ID!) {
  user(id: $id) {
    id
    email
    name
    posts {
      id
      title
      content
      createdAt
      updatedAt
    }
  }
}

`

export const GET_USERS = `
query GetUsers($options: GetListOptions) {
  users(options: $options) {
    meta {
      total
      perPage
      currentPage
      lastPage
    }
    data {
      id
      email
      name
    }
  }
}
`
