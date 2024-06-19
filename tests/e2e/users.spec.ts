import { test } from '@japa/runner'
import { sendGraphqlRequest } from './utils.js'
import { CREATE_USER, GET_USER, GET_USERS, UPDATE_USER } from '../queries/user.js'

test.group('Users', () => {
  let userId: number

  test('create a new user', async ({ client }) => {
    const response = await sendGraphqlRequest(client, CREATE_USER, {
      input: {
        email: 'johndoe@example.com',
        name: 'John Doe',
        password: 'secret',
      },
    })

    response.assertBodyContains({
      data: {
        createUser: {
          id: Number,
          email: 'johndoe@example.com',
          name: 'John Doe',
          status: 'active',
          createdAt: String,
          updatedAt: String,
        },
      },
    })

    userId = response.body().data.createUser.id
  })

  test('fetch a user by id', async ({ client }) => {
    const response = await sendGraphqlRequest(client, GET_USER, {
      id: userId,
    })

    response.assertBodyContains({
      data: {
        user: {
          id: userId,
          name: 'John Doe',
          email: 'johndoe@example.com',
        },
      },
    })
  })

  test('fetch all users', async ({ client }) => {
    const response = await sendGraphqlRequest(client, GET_USERS, {
      options: {
        page: 1,
        limit: 10,
      },
    })
    response.assertBodyContains({
      data: {
        users: {
          meta: {
            total: 1,
            currentPage: 1,
            lastPage: 1,
            perPage: 10,
          },
          data: [
            {
              id: userId,
              name: 'John Doe',
              email: 'johndoe@example.com',
            },
          ],
        },
      },
    })
  })

  test('update a user', async ({ client }) => {
    const response = await sendGraphqlRequest(client, UPDATE_USER, {
      id: userId,
      input: {
        name: 'Jane Doe',
      },
    })

    response.assertBodyContains({
      data: {
        updateUser: {
          id: userId,
          name: 'Jane Doe',
        },
      },
    })
  })
})
