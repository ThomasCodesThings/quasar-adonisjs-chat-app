import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UserKicks extends BaseSchema {
  protected tableName = 'user_kicks'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('user_sender_id').notNullable()
      table.integer('user_kicked_id').notNullable()
      table.integer('channel_id').notNullable()
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
