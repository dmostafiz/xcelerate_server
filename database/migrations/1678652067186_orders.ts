import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

      table.integer('address_id')
        .unsigned()
        .references('id')
        .inTable('shipping_addresses')
        .onDelete('CASCADE')

      table.float('order_total').defaultTo(0.0)
      table.float('cart_total').defaultTo(0.0)
      table.float('tax').defaultTo(0.0)
      table.float('shipping_cost').defaultTo(0.0)

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.timestamp('deleted_at', { useTz: true }).nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
