import { BaseModel } from '@adonisjs/lucid/orm'
import { Property } from '../../src/decorators/property.js'

export class Avatar extends BaseModel {
  @Property({ isPrimary: true })
  declare id: string

  @Property()
  declare userId: string

  @Property()
  declare url: string
}
