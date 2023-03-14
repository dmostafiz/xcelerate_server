import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'commission_amounts'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('is_first').defaultTo(false).after('is_completed')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, table => {
      table.dropColumn('is_first')
    })
  }
}
