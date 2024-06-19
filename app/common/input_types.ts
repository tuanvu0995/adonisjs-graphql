import { InputType, Property } from '../../src/decorators/index.js'
import { Int } from '../../src/scalars/index.js'

@InputType()
export class SortOptions {
  @Property()
  declare field: string

  @Property()
  declare order: 'asc' | 'desc'
}

@InputType()
export class GetListOptions {
  @Property({ type: () => Int, nullable: true })
  declare page: number

  @Property({ type: () => Int, nullable: true })
  declare limit: number

  @Property({ type: () => SortOptions, nullable: true })
  declare sort: SortOptions
}
