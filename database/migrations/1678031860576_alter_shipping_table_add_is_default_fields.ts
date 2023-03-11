import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'shipping_addresses'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('is_default').defaultTo(false).after('zip_code')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, table => {
      table.dropColumn('is_default')
    })
  }
}
