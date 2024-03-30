import { Arg, Args, ArgsType, Mutation, Parent, Property, Query, Resolver } from '../../index.js'
import { Avatar } from './avatar.js'
import { CreateUserInput, User } from './user.js'

@ArgsType()
export class PaginateUserArgs {
  @Property()
  declare page: number

  @Property()
  declare limit: number
}

@Resolver(() => User)
export class UserResolver {
  @Query(() => [User])
  async users(@Args() { limit, page }: PaginateUserArgs): Promise<User[]> {
    console.log(limit, page)
    return []
  }

  @Mutation(() => User)
  async createUser(@Arg('input') input: CreateUserInput): Promise<User> {
    console.log(input)
    return new User()
  }

  @Property.resolver(() => Avatar)
  async avatar(@Parent() user: User): Promise<Avatar> {
    console.log(user.id)
    return new Avatar()
  }
}
