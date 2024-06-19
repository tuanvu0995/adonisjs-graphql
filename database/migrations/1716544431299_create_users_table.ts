import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('full_name', 255).nullable()
      table.string('email', 255).notNullable()
      table.string('password').notNullable()
      table.string('name', 255).nullable()
      table.text('bio').nullable()
      table.string('gender', 16).nullable()
      table.string('status', 16).notNullable().defaultTo('pending')
      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.index(['email'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
