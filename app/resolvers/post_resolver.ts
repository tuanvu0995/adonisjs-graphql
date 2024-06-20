import { Arg, Mutation, Query, Resolver } from '../../src/decorators/index.js'
import { inject } from '@adonisjs/core'
import Post, { CreatePostInput } from '../models/post.js'
import { ID } from '../../src/scalars/index.js'
import Tag from '../models/tag.js'
import stringHelpers from '@adonisjs/core/helpers/string'

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

    if (input.tags) {
      const tags = await this.upsertTags(input.tags)
      await post.related('tags').attach(tags.map((tag) => tag.id))
    }

    return post
  }

  private async upsertTags(tagNames: string[]) {
    const tags = await Promise.all(
      tagNames.map(async (tag) => {
        const slug = stringHelpers.slug(tag, {
          lower: true,
          replacement: '-',
          strict: true,
        })
        const existingTag = await Tag.query().where('slug', slug).first()
        if (existingTag) {
          return existingTag
        }
        return await Tag.create({
          name: tag,
          slug,
        })
      })
    )
    return tags
  }
}
