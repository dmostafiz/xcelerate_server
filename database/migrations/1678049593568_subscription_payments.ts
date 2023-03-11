import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'subscription_payments'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('user_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')

      table.integer('subscription_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('subscriptions')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')

      // pending / completed / cancelled
      table.string('status').nullable().defaultTo('pending')

      table.string('note').nullable()

      table.float('amount').defaultTo(0.00)

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
