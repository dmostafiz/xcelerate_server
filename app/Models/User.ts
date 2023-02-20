import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, hasMany, HasMany, computed } from '@ioc:Adonis/Lucid/Orm';
import ShippingAddress from './ShippingAddress'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public username: string

  @column()
  public first_name: string

  @column()
  public last_name: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public avatar: string
  
  @column()
  public phone_num: string
  
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

  @hasMany(() => ShippingAddress, {
    foreignKey: 'user_id',
    localKey: 'id'
  })

  public shippings: HasMany<typeof ShippingAddress>
  
  @column()
  public user_type: string
  
  @column()
  public rememberMeToken: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime


  @computed()
  public get full_name() {
    return `${this.first_name} ${this.last_name}`
  }

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
