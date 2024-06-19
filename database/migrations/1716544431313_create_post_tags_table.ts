import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'post_tags'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('post_id').unsigned().references('id').inTable('posts').onDelete('CASCADE')
      table.integer('tag_id').unsigned().references('id').inTable('tags').onDelete('CASCADE')

      table.index(['post_id', 'tag_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
