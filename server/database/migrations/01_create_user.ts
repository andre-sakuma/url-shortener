import * as Knex from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('users', table => {
    table.string('id').notNullable();
    table.string('name').notNullable();
    table.string('password').notNullable();
    table.string('urls').notNullable();
    table.string('createdAt');
    table.boolean('isVisible');
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('users')
}