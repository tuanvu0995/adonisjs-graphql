import { BaseModel } from '@adonisjs/lucid/orm'
import { Property } from '../../src/decorators/property.js'
import { Tag } from './tag.js'
import { User } from './user.js'

export class Post extends BaseModel {
  @Property({ isPrimary: true })
  declare id: string

  @Property()
  declare userId: string

  @Property()
  declare title: string

  @Property()
  declare content: string

  @Property.belongsTo(() => User)
  declare user: User

  @Property.manyToMany(() => [Tag])
  declare tags: Tag[]

  @Property.dateTime()
  declare createdAt: Date

  @Property.dateTime()
  declare updatedAt: Date
}
