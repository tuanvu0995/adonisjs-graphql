import { DateTime } from 'luxon'
import { ID, Property } from 'adonisjs-graphql'
import { BaseModel, belongsTo, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Tag from './tag.js'

export default class Post extends BaseModel {
  @Property({ isPrimary: true, type: () => ID })
  declare id: number

  @Property({ type: () => ID })
  declare userId: number

  @Property()
  declare title: string

  @Property()
  declare slug: string

  @Property()
  declare content: string

  @Property()
  declare status: string

  @Property.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @Property.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  @Property.belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @manyToMany(() => Tag, {
    pivotTable: 'post_tag',
  })
  @Property.manyToMany(() => [Tag])
  declare tags: ManyToMany<typeof Tag>
}
