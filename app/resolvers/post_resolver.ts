import { Arg, Mutation, Query, Resolver } from '../../src/decorators/index.js'
import { inject } from '@adonisjs/core'
import Post, { CreatePostInput } from '../models/post.js'
import { ID } from '../../src/scalars/index.js'

@inject()
@Resolver(() => Post)
export default class PostResolver {
  @Query(() => Post)
  async post(@Arg('id', { type: () => ID }) id: number) {
    const post = await Post.findOrFail(id)
    return post
  }

  @Mutation(() => Post)
  async createPost(@Arg('input') input: CreatePostInput) {
    const post = await Post.create({
      ...input,
      userId: Number(input.userId),
    })
    return post
  }
}
