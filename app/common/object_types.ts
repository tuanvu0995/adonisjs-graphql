import { Property } from '../../src/decorators/property.js'

export class PaginationMetadata {
  @Property.int()
  declare total: number

  @Property.int()
  declare perPage: number

  @Property.int()
  declare currentPage: number

  @Property.int()
  declare lastPage: number
}
