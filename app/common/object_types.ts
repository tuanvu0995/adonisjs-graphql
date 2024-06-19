import { Property } from '../../src/decorators/property.js'
import { Int } from '../../src/scalars/index.js'

export class PaginationMetadata {
  @Property({ type: () => Int })
  declare total: number

  @Property({ type: () => Int })
  declare perPage: number

  @Property({ type: () => Int })
  declare currentPage: number

  @Property({ type: () => Int })
  declare lastPage: number
}
