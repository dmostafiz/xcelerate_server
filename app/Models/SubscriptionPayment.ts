import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { compose } from '@ioc:Adonis/Core/Helpers';
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes';

export default class SubscriptionPayment extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime({ columnName: 'deleted_at' })
  public deleted_at: DateTime | null
}
