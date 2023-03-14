import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // received | shipped | delivered | refunded
      table.string('status').nullable().defaultTo('received').after('shipping_cost')
      table.boolean('is_first').defaultTo(false).after('status')

      // recurring | regular
      table.string('order_type').nullable().defaultTo('regular').after('is_fast')

      // shippo fileds
      table.string('shippo_order_id').nullable().after('order_type')
      table.string('shippo_address_id').nullable().after('shippo_order_id')
      table.string('shippo_order_number').nullable().after('shippo_address_id')
      table.string('tracking_url').nullable().after('shippo_order_number')
      table.string('tracking_number').nullable().after('tracking_url')
      table.string('label_url').nullable().after('tracking_number')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, table => {
      table.dropColumn('status')
      table.dropColumn('order_type')
      table.dropColumn('shippo_order_id')
      table.dropColumn('shippo_address_id')
      table.dropColumn('shippo_order_number')
      table.dropColumn('tracking_url')
      table.dropColumn('tracking_number')
      table.dropColumn('label_url')
    })
  }
}
