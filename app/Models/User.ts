import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, hasMany, HasMany, computed, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm';
import ShippingAddress from './ShippingAddress'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes'
import Order from './Order';
import Subscription from './Subscription';
import CommissionAmount from './CommissionAmount';
import Matrix from './Matrix';
import MatrixPair from './MatrixPair';

export default class User extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  public id: number

  @column()
  public matrix_id: number
  
  @belongsTo(() => Matrix, {
    localKey: 'id',
    foreignKey: 'matrix_id',
  })
  public matrix: BelongsTo<typeof Matrix>

  @hasMany(() => MatrixPair, {
    foreignKey: 'user_id',
    localKey: 'id',
  })
  public pairs: HasMany<typeof MatrixPair>

  @column()
  public ref_by: number

  @belongsTo(() => User, {
    localKey: 'ref_by',
    foreignKey: 'id',
  })
  public parent: BelongsTo<typeof User>

  @hasMany(() => User, {
    localKey: 'id',
    foreignKey: 'ref_by',
  })

  public children: HasMany<typeof User>

  @column()
  public is_member: boolean

  @column()
  public is_affiliate: boolean

  @column()
  public stripe_customer_id: string

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

  @column.dateTime({ columnName: 'deleted_at' })
  public deleted_at: DateTime | null

  @hasMany(() => Subscription, {
    foreignKey: 'user_id',
    localKey: 'id',
  })
  public subscriptions: HasMany<typeof Subscription>

  @hasMany(() => Order, {
    foreignKey: 'user_id',
    localKey: 'id'
  })
  public orders: HasMany<typeof Order>

  @hasMany(() => CommissionAmount, {
    foreignKey: 'user_id',
    localKey: 'id'
  })
  public commission_given: HasMany<typeof CommissionAmount>

  @computed()
  public get full_name() {
    return `${this.first_name} ${this.last_name}`
  }

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
