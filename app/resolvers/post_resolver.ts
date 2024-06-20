import { Arg, Mutation, Resolver } from '../../src/decorators/index.js'
import { inject } from '@adonisjs/core'
import Post, { CreatePostInput } from '../models/post.js'

@inject()
@Resolver(() => Post)
export default class PostResolver {
  @Mutation(() => Post)
  async createPost(@Arg('input') input: CreatePostInput) {
    const post = await Post.create({
      ...input,
      userId: Number(input.userId),
    })
    return post
  }
}
