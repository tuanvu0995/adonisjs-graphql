import { DateTime } from 'luxon'
import { BaseModel } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Tag from './tag.js'
import { InputType, Property } from '../../src/decorators/index.js'
import { ID, String } from '../../src/scalars/index.js'

@InputType()
export class CreatePostInput {
  @Property()
  declare title: string

  @Property()
  declare content: string

  @Property.id()
  declare userId: string

  @Property(() => [String], { nullable: true })
  declare tags?: string[]
}

export default class Post extends BaseModel {
  @Property.id({ isPrimary: true })
  declare id: number

  @Property.id()
  declare userId: number

  @Property()
  declare title: string

  @Property()
  declare content: string

  @Property()
  declare status: string

  @Property.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @Property.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @Property.belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @Property.manyToMany(() => Tag, {
    pivotTable: 'post_tags',
  })
  declare tags: ManyToMany<typeof Tag>
}
