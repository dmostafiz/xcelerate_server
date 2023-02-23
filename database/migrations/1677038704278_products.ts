import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('name', 255).nullable()
      table.text('description').nullable()
      table.integer('length').unsigned().defaultTo(0)
      table.integer('width').unsigned().defaultTo(0)
      table.integer('height').unsigned().defaultTo(0)
      table.string('distance_unit').nullable().defaultTo('in')
      table.integer('weight').unsigned().defaultTo(0)
      table.string('mass_unit').nullable().defaultTo('in')
      table.float('price').unsigned().defaultTo(0)
      table.integer('cv').unsigned().defaultTo(0)
      table.json('image').nullable()
      table.integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

      table.boolean('status').defaultTo(true)
      table.boolean('is_deleted').defaultTo(false)
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
      */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.timestamp('deleted_at', { useTz: true }).nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
