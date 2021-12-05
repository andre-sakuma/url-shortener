import * as Knex from 'knex'

export async function up(knex: Knex) {
  return knex.schema.createTable('categories', table => {
    table.uuid('id').primary()
    table.boolean('active').notNullable()
    table.string('name').notNullable()
    table.timestamp('createdAt').notNullable()
  })
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('categories')
}