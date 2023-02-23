import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('username').nullable().unique()
      table.string('first_name').nullable()
      table.string('last_name').nullable()
      table.string('email', 100).nullable().unique()
      table.string('password', 180).nullable()
      table.string('avatar', 180).nullable()

      //Contact
      table.string('phone_num', 30).nullable().unique()

      //Address
      table.string('street_one', 255).nullable()
      table.string('street_two', 255).nullable()
      table.string('country', 50).nullable()
      table.string('state', 50).nullable()
      table.string('city', 50).nullable()
      table.string('zip_code', 50).nullable()

      //admin | employee | user
      table.string('user_type').defaultTo('user')

      table.string('role').nullable()
 
      table.string('remember_me_token').nullable()

      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
      table.timestamp('deleted_at', { useTz: true }).nullable()
  
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
