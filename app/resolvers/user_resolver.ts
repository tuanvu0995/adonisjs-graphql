import User, {
  AccountStatus,
  CreateUserInput,
  GetUserByEmailInput,
  UpdateUserInput,
  UserPagination,
} from '../models/user.js'
import {
  Arg,
  Args,
  Context,
  Mutation,
  Parent,
  Property,
  Query,
  Resolver,
} from '../../src/decorators/index.js'
import { inject } from '@adonisjs/core'
import { GetListOptions } from '../common/input_types.js'
import { ID } from '../../src/scalars/index.js'
import type { HttpContext } from '@adonisjs/core/http'
import Profile, { UpdateProfileInput } from '../models/profile.js'

@inject()
@Resolver(() => User)
export default class UserResolver {
  @Query(() => UserPagination)
  async users(
    @Arg('options', { type: () => GetListOptions, nullable: true }) options: GetListOptions
  ): Promise<UserPagination> {
    const { page = 1, limit = 10 } = options
    const users = await User.query()
      .orderBy(options.sort?.field || 'createdAt', options.sort?.order || 'desc')
      .paginate(page, limit)
    return {
      meta: users.getMeta(),
      data: users,
    }
  }

  @Query(() => User)
  async user(@Arg('id', { type: () => ID }) id: number) {
    const user = await User.query().where('id', id).first()
    return user
  }

  @Mutation(() => User)
  async createUser(@Arg('input') input: CreateUserInput) {
    const user = await User.create({
      ...input,
      status: AccountStatus.ACTIVE,
    })
    return user
  }

  @Mutation(() => User)
  async updateUser(
    @Arg('id', { type: () => ID }) id: number,
    @Arg('input') input: UpdateUserInput,
    @Context() _ctx: HttpContext
  ) {
    const user = await User.findOrFail(id)
    user.merge(input)
    await user.save()
    return user
  }

  @Mutation(() => Profile)
  async updateProfile(@Arg('input') input: UpdateProfileInput) {
    let profile = await Profile.query().where('user_id', input.userId).first()
    if (!profile) {
      profile = await Profile.create(input as any)
    } else {
      profile.merge(input as any)
      await profile.save()
    }

    return profile
  }

  @Property.resolver(() => String)
  async avatar(@Parent() user: User): Promise<string> {
    return 'https://api.adorable.io/avatars/150/' + user.email + '.png'
  }

  @Query(() => User)
  async userByEmail(@Args() args: GetUserByEmailInput, @Context() _ctx: HttpContext) {
    const email = args.email
    const user = await User.findBy('email', email)
    return user
  }
}
