import { BaseModel } from '@adonisjs/lucid/orm'
import { Property } from '../../src/decorators/property.js'
import { Post } from './post.js'

export class Tag extends BaseModel {
  @Property({ isPrimary: true })
  declare id: string

  @Property()
  declare name: string

  @Property()
  declare slug: string

  @Property.manyToMany(() => [Post])
  declare posts: Post[]
}
