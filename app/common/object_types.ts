import { Property } from '../../src/decorators/property.js'

export class PaginationMetadata {
  @Property()
  declare total: number

  @Property()
  declare perPage: number

  @Property()
  declare currentPage: number

  @Property()
  declare lastPage: number
}
