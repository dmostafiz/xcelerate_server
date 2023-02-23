import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('status').defaultTo(true).after('user_id')
      table.boolean('is_deleted').defaultTo(false).after('status')
  
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('status')
      table.dropColumn('is_deleted')
    })
  }
}
