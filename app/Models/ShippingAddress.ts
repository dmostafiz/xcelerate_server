import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import { compose } from '@ioc:Adonis/Core/Helpers';
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes';

export default class ShippingAddress extends compose(BaseModel, SoftDeletes)  {
  @column({ isPrimary: true })
  public id: number

  @column()
  public street_one: string
  
  @column()
  public street_two: string

  @column()
  public country: string

  @column()
  public country_name: string

  @column()
  public state: string

  @column()
  public city: string

  @column()
  public zip_code: string

  @column()
  public is_default: boolean
  
  @column()
  public user_id: number 

  @belongsTo(() => User, {
    foreignKey: 'id',
    localKey: 'user_id'
  })
  public user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime({ columnName: 'deleted_at' })
  public deleted_at?: DateTime | null
}
