import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm';
import { compose } from '@ioc:Adonis/Core/Helpers';
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes';
import User from './User';
import MatrixPair from './MatrixPair';

export default class Matrix extends compose(BaseModel, SoftDeletes) {

  public static table = 'matrixes'

  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number
  
  // Relation with User as matrix user
  @belongsTo(() => User, {
    foreignKey: 'user_id',
    localKey: 'id'
  })
  public user: BelongsTo<typeof User>

  @column()
  public parent_matrix_id: number | null

  // Relation with Matrix as parent
  @belongsTo(() => Matrix, {
    foreignKey: 'parent_matrix_id',
    localKey: 'id'
  })
  public parent_matrix: BelongsTo<typeof Matrix>


    // Relation with MatrixPair as children matrix_pairs
    @hasMany(() => MatrixPair, {
      foreignKey: 'matrix_id',
      localKey: 'id'
    })
    public pairs: HasMany<typeof MatrixPair>


  @column()
  public parent_user_id: number | null

  // Relation with User as matrix parent user
  @belongsTo(() => User, {
    foreignKey: 'parent_user_id',
    localKey: 'id'
  })
  public parent_user: BelongsTo<typeof User>


  @column()
  public status: boolean
  
  // time stamps
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime({ columnName: 'deleted_at' })
  public deleted_at: DateTime | null

}
