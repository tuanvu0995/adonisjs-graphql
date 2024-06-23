import { DateTime } from 'luxon'
import { BaseModel } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { InputType, Property } from '../../src/decorators/index.js'
import User from './user.js'

@InputType()
export class UpdateProfileInput {
  @Property.id()
  declare userId: string

  @Property()
  declare firstName: string

  @Property.id()
  declare lastName: string
}

export default class Profile extends BaseModel {
  @Property.id({ isPrimary: true })
  declare id: number

  @Property.id()
  declare userId: string

  @Property()
  declare firstName: string

  @Property()
  declare lastName: string

  @Property.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @Property.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @Property.belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
