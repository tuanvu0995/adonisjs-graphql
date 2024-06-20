import { DateTime } from 'luxon'
import { BaseModel } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { Property } from '../../src/decorators/index.js'
import { ID } from '../../src/scalars/index.js'
import User from './user.js'

export default class Profile extends BaseModel {
  @Property({ isPrimary: true, type: () => ID })
  declare id: number

  @Property({ type: () => ID })
  declare user_id: string

  @Property()
  declare first_name: string

  @Property()
  declare last_name: string

  @Property.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @Property.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @Property.belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
