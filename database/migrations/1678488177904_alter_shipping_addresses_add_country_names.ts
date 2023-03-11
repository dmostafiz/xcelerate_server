import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'shipping_addresses'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('country_name').nullable().defaultTo('Bangladesh').after('country')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, table => {
      table.dropColumn('country_name')
    })
  }
}
