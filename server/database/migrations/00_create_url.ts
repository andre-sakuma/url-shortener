import * as Knex from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('urls', table => {
    table.increments('id').primary();
    table.string('thumb');
    table.string('name').notNullable();
    table.string('userId').notNullable();
    table.string('description').notNullable();
    table.decimal('clicks').notNullable();
    table.string('shortUrl').notNullable();
    table.string('originalUrl').notNullable();
    table.boolean('isVisible');
    table.string('createdAt');
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('urls')
}