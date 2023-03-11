import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'subscriptions'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      //  affiliate_member | only_member
      table.string('member_type').defaultTo('affiliate_member').after('type')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, table => {
      table.dropColumn('member_type')
    })
  }
}
