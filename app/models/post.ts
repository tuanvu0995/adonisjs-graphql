import { DateTime } from 'luxon'
import { BaseModel, manyToMany } from '@adonisjs/lucid/orm'
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

  @Property({ type: () => ID })
  declare userId: string

  @Property({ type: () => [String], nullable: true })
  declare tags?: string[]
}

export default class Post extends BaseModel {
  @Property({ isPrimary: true, type: () => ID })
  declare id: number

  @Property({ type: () => ID })
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

  @manyToMany(() => Tag, {
    pivotTable: 'post_tags',
  })
  @Property.manyToMany(() => Tag, {
    pivotTable: 'post_tags',
  })
  declare tags: ManyToMany<typeof Tag>
}
