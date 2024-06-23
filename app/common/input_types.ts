import { InputType, Property } from '../../src/decorators/index.js'

@InputType()
export class SortOptions {
  @Property()
  declare field: string

  @Property()
  declare order: 'asc' | 'desc'
}

@InputType()
export class GetListOptions {
  @Property.int({ nullable: true })
  declare page: number

  @Property.int({ nullable: true })
  declare limit: number

  @Property(() => SortOptions, { nullable: true })
  declare sort: SortOptions
}
