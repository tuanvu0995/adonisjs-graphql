import User from '../models/user'
import { Arg, Mutation, Query, ID, Parent, Property, Resolver } from '../../src/decorators/index'
import { CreateUserInput, GetUserListOptions, UserPagination } from '../dtos/user_dto.js'
import { inject } from '@adonisjs/core'
import Tag from '#models/tag'
import { UserService } from '#services/user_service'

@inject()
@Resolver(() => User)
export default class UserResolver {
  constructor(protected userService: UserService) {}

  @Query(() => UserPagination)
  async users(
    @Arg('options', { type: () => GetUserListOptions, nullable: true }) options: GetUserListOptions
  ): Promise<UserPagination> {
    const { page = 1, limit = 10 } = options || {}
    const users = await this.userService.find({ page, limit })
    return {
      meta: users.getMeta(),
      data: users,
    }
  }

  @Query(() => User)
  async user(@Arg('id', { type: () => ID }) id: number) {
    const user = await this.userService.findOne(id)
    return user
  }

  @Mutation(() => User)
  async createUser(@Arg('input') input: CreateUserInput) {
    const newUser = await this.userService.create(input)
    return newUser
  }

  @Property.resolver(() => Tag)
  async tag(@Parent() user: User) {
    const tag = await Tag.findBy('id', 1)
    return tag
  }
}
