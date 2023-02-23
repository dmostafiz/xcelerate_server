import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'alter_users_add_deleted_ats'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('status').defaultTo(true).after('role')
      table.timestamp('deleted_at', { useTz: true }).nullable().after('updated_at')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('status')
      table.dropColumn('deleted_at')
    })
  }
}
