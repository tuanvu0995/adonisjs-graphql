import User, {
  AccountStatus,
  CreateUserInput,
  UpdateUserInput,
  UserPagination,
} from '../models/user.js'
import { Arg, Mutation, Parent, Property, Query, Resolver } from '../../src/decorators/index.js'
import { inject } from '@adonisjs/core'
import { GetListOptions } from '../common/input_types.js'
import { ID } from '../../src/scalars/index.js'

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
    @Arg('input') input: UpdateUserInput
  ) {
    const user = await User.findOrFail(id)
    user.merge(input)
    await user.save()
    return user
  }

  @Property.resolver(() => String)
  async avatar(@Parent() user: User): Promise<string> {
    return 'https://api.adorable.io/avatars/150/' + user.email + '.png'
  }
}
