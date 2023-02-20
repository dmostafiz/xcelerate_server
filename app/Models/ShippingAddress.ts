import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class ShippingAddress extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public street_one: string
  
  @column()
  public street_two: string

  @column()
  public country: string

  @column()
  public state: string

  @column()
  public city: string

  @column()
  public zip_code: string
  
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
}
