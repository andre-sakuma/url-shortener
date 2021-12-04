import * as Knex from 'knex'

export async function up(knex: Knex) {
  return knex.schema.createTable('users', table => {
    table.uuid('id').primary()
    table.boolean('active').notNullable()
    table.string('username').notNullable()
    table.string('email').notNullable()
    table.string('password').notNullable()
    table.timestamp('createdAt')
  })
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('users')
}