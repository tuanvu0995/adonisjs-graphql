import { BaseModel } from '@adonisjs/lucid/orm'
import { InputType } from '../../index.js'
import { Property } from '../../src/decorators/property.js'
import { Avatar } from './avatar.js'
import { Post } from './post.js'

export class User extends BaseModel {
  @Property({ isPrimary: true })
  declare id: string

  @Property()
  declare name: string

  @Property()
  declare email: string

  @Property()
  declare password: string

  @Property({ nullable: true })
  declare age?: number

  @Property.hasMany(() => [Post])
  declare posts: Post[]

  @Property.hasOne(() => [Avatar], {
    nullable: true,
  })
  declare avatar?: Avatar
}

@InputType()
export class CreateUserInput {
  @Property()
  declare name: string

  @Property()
  declare email: string

  @Property()
  declare password: string

  @Property({ nullable: true })
  declare age?: number
}
