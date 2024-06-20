import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column } from '@adonisjs/lucid/orm'
import type { HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import Post from './post.js'
import hash from '@adonisjs/core/services/hash'
import { ID, registerEnumType } from '../../src/scalars/index.js'
import { Property, InputType } from '../../src/decorators/index.js'
import { PaginationMetadata } from '../common/object_types.js'
import Profile from './profile.js'

export enum AccountStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  DISABLED = 'disabled',
  WAITING = 'waiting',
}

registerEnumType(AccountStatus, {
  name: 'AccountStatus',
  description: 'The status of the user account',
  valuesConfig: {
    WAITING: {
      description: 'The account is waiting for approval',
      deprecationReason: 'Use `PENDING` instead',
    },
  },
})

@InputType()
export class CreateUserInput {
  @Property()
  declare name: string

  @Property()
  declare email: string

  @Property()
  declare password: string
}

@InputType()
export class UpdateUserInput {
  @Property({ nullable: true })
  declare name: string

  @Property({ nullable: true })
  declare email: string

  @Property({ nullable: true })
  declare password: string
}
export class UserPagination {
  @Property({ type: () => PaginationMetadata })
  declare meta: PaginationMetadata

  @Property({ type: () => [User] })
  declare data: User[]
}

@InputType()
export class GetUserByEmailInput {
  @Property()
  declare email: string
}

export default class User extends BaseModel {
  @Property({
    isPrimary: true,
    type: () => ID,
  })
  declare id: number

  @Property({
    description: 'The full name of the user',
    deprecationReason: 'Use `name` instead',
  })
  declare fullName: string | null

  @Property()
  declare name: string

  @Property()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @Property({ type: () => AccountStatus })
  declare status: AccountStatus

  @Property.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @Property.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @Property.hasMany(() => Post)
  declare posts: HasMany<typeof Post>

  @Property.hasOne(() => Profile, {
    nullable: true,
  })
  declare profile: HasOne<typeof Profile>

  @beforeSave()
  static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await hash.make(user.password)
    }
  }
}
