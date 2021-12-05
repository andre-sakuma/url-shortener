import * as Knex from 'knex'

export async function up(knex: Knex) {
  return knex.schema.createTable('urls', table => {
    table.uuid('id').primary()
    table.string('categoryId')
    table.boolean('active').notNullable()
    table.boolean('shareable').notNullable()
    table.string('userId').notNullable()
    table.decimal('clicks').notNullable()
    table.string('thumbUrl')
    table.string('redirectUrl').notNullable()
    table.string('code').notNullable()
    table.string('description').notNullable()
    table.string('shortUrl').notNullable()
    table.timestamp('createdAt').notNullable()
    table.timestamp('expiresAt').notNullable()
  })
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('urls')
}