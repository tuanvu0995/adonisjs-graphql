import { test } from '@japa/runner'
import { sendGraphqlRequest } from './utils.js'
import { CREATE_USER, GET_USER_WITH_POSTS } from '../queries/user.js'
import { CREATE_POST, GET_POST_WITH_AUTHOR } from '../queries/post.js'
import testUtils from '@adonisjs/core/services/test_utils'

test.group('Relations', (group) => {
  group.setup(() => testUtils.db().truncate())

  let userId: number
  let postId: number

  test('has many', async ({ client }) => {
    const createUserRsp = await sendGraphqlRequest(client, CREATE_USER, {
      input: {
        email: 'johndoe@example.com',
        name: 'John Doe',
        password: 'secret',
      },
    })
    userId = createUserRsp.body().data.createUser.id

    const createPostRsp = await sendGraphqlRequest(client, CREATE_POST, {
      input: {
        title: 'Hello World',
        content: 'This is my first post',
        userId,
      },
    })

    postId = createPostRsp.body().data.createPost.id

    const response = await sendGraphqlRequest(client, GET_USER_WITH_POSTS, {
      id: userId,
    })

    response.assertBodyContains({
      data: {
        user: {
          id: userId,
          email: 'johndoe@example.com',
          name: 'John Doe',
          posts: [
            {
              id: postId,
              title: 'Hello World',
              content: 'This is my first post',
            },
          ],
        },
      },
    })
  })

  test('belongs to', async ({ client }) => {
    const response = await sendGraphqlRequest(client, GET_POST_WITH_AUTHOR, {
      id: postId,
    })

    response.assertBodyContains({
      data: {
        post: {
          id: postId,
          title: 'Hello World',
          content: 'This is my first post',
          user: {
            id: userId,
            name: 'John Doe',
          },
        },
      },
    })
  })
})
