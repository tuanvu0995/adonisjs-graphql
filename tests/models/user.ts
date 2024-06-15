import { DateTime } from 'luxon'
import { ID, registerEnumType } from '../../src/scalars/index'
import { BaseModel } from '@adonisjs/lucid/orm'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Post from './post.js'
import { Property } from '../../src/decorators'

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

  @Property({
    serializeAs: null,
  })
  declare password: string

  @Property({ type: () => AccountStatus })
  declare status: AccountStatus

  @Property.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @Property.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(User)

  @Property.hasMany(() => Post)
  declare posts: HasMany<typeof Post>
}
