import { DateTime } from 'luxon'
import { BaseModel, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Post from './post.js'
import { ID, Property } from 'adonisjs-graphql'

export default class Tag extends BaseModel {
  @Property({ isPrimary: true, type: () => ID })
  declare id: number

  @Property()
  declare name: string

  @Property()
  declare slug: string

  @Property()
  declare description?: string

  @Property.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @Property.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @manyToMany(() => Post, {
    pivotTable: 'post_tag',
  })
  @Property.manyToMany(() => [Post])
  declare posts: ManyToMany<typeof Post>
}
