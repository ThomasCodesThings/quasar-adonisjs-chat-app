import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class ChannelUser extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  
  @column()
  public user_id: number

  @column()
  public channel_id: number

  @column()
  public voteKickCount: number

  @column()
  public isInvited: boolean

  @column()
  public isBanned: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
