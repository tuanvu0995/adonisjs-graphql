import { DateTime } from 'luxon'
import { BaseModel } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { InputType, Property } from '../../src/decorators/index.js'
import { ID } from '../../src/scalars/index.js'
import User from './user.js'

@InputType()
export class UpdateProfileInput {
  @Property({ type: () => ID })
  declare userId: string

  @Property()
  declare firstName: string

  @Property({ type: () => ID })
  declare lastName: string
}

export default class Profile extends BaseModel {
  @Property({ isPrimary: true, type: () => ID })
  declare id: number

  @Property({ type: () => ID })
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
