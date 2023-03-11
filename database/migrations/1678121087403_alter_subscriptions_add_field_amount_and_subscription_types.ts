import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'subscriptions';

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.float('amount').defaultTo(0.00).after('stripe_sub_id')

      // month |year
      table.string('type').nullable().after('amount')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, table => {
      table.dropColumn('amount')
      table.dropColumn('type')
    })
  }
}
