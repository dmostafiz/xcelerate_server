import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('matrix_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('matrixes')
        .onDelete('CASCADE')
        .after('id')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, table => {
      table.dropColumn('stripe_customer_id')
    })
  }
}
