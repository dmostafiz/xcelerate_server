import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, HasMany, hasMany, BelongsTo } from '@ioc:Adonis/Lucid/Orm';
import { compose } from '@ioc:Adonis/Core/Helpers';
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes';
import OrderItem from './OrderItem';
import User from './User';
import ShippingAddress from './ShippingAddress';

export default class Order extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number

  @column()
  public address_id: number

  @column()
  public order_total: number

  @column()
  public cart_total: number

  @column()
  public tax: number

  @column()
  public shipping_cost: number

  @column()
  public status: 'received' | 'shipped' | 'refunded' | 'delivered'

  @column()
  public is_first: boolean


  @column()
  public order_type: 'recurring' | 'regular'

  @column()
  public shippo_order_id: string | null

  @column()
  public shippo_address_id: string | null

  @column()
  public shippo_order_number: string | null

  @column()
  public tracking_url: string | null

  @column()
  public tracking_number: string | null

  @column()
  public label_url: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime({ columnName: 'deleted_at' })
  public deleted_at: DateTime | null

  @hasMany(() => OrderItem, {
    foreignKey: 'order_id',
    localKey: 'id',
  })
  public order_items: HasMany<typeof OrderItem>

  @belongsTo(() => User, {
    foreignKey: 'user_id',
    localKey: 'id',
  })
  public user: BelongsTo<typeof User>

  @belongsTo(() => ShippingAddress, {
    foreignKey: 'address_id',
    localKey: 'id',
  })
  public address: BelongsTo<typeof ShippingAddress>


}
