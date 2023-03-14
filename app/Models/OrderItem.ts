import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes';
import { compose } from '@ioc:Adonis/Core/Helpers';
import Order from './Order';
import Product from './Product';

export default class OrderItem extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number

  @column()
  public order_id: number

  @column()
  public product_id: number

  @column()
  public unit_price: number

  @column()
  public quantity: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime({ columnName: 'deleted_at' })
  public deleted_at: DateTime | null

  @belongsTo(() => Order, {
    localKey: 'order_id',
    foreignKey: 'id'
  })
  public order: BelongsTo<typeof Order>

  @belongsTo(() => Product, {
    localKey: 'id',
    foreignKey: 'product_id'
  })
  
  public product: BelongsTo<typeof Product>

}
