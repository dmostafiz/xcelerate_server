import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, BelongsTo } from '@ioc:Adonis/Lucid/Orm';
import { compose } from '@ioc:Adonis/Core/Helpers';
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes';
import Matrix from './Matrix';
import User from './User';

export default class MatrixPair extends compose(BaseModel, SoftDeletes) {

  public static table = 'matrix_pairs'

  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number

  // Relation with user as matrix_pair user
  @belongsTo(() => User, {
    foreignKey: 'user_id',
    localKey: 'id'
  })
  public user: BelongsTo<typeof User>

  @column()
  public matrix_id: number

  // Relation with Matrix
  @belongsTo(() => Matrix, {
    foreignKey: 'matrix_id',
    localKey: 'id'
  })
  public matrix: BelongsTo<typeof Matrix>


  @column()
  public child_id: number | null

  // Relation with User as matrix_pair child
  @belongsTo(() => User, {
    localKey: 'id',
    foreignKey: 'child_id',
  })
  public child: BelongsTo<typeof User>


  // Time stamps
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime({ columnName: 'deleted_at' })
  public deleted_at: DateTime | null
}
