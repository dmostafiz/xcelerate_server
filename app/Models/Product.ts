import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm';
import User from './User';
import { compose } from '@ioc:Adonis/Core/Helpers';
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes';

export default class Product extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public description: string 

  @column()
  public length: number 

  @column()
  public width: number 

  @column()
  public height: number 

  @column()
  public distance_unit: string 

  @column()
  public weight: number  

  @column()
  public mass_unit: string 


  @column()
  public price: number 

  @column()
  public member_price: number 
  
  @column()
  public cv: number 
  
  @column()
  public image: Object 

  @column()
  public user_id: number 
  
  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column()
  public status: boolean


  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
