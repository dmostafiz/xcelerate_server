import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'commission_amounts'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('is_matrix').defaultTo(false).after('is_first')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, table => {
      table.dropColumn('is_matrix')
    })
  }
}
