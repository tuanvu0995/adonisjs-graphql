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
