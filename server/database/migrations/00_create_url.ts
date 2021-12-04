import * as Knex from 'knex'

export async function up(knex: Knex) {
  return knex.schema.createTable('urls', table => {
    table.uuid('id').primary()
    table.boolean('active')
    table.boolean('shareable')
    table.string('userId').notNullable()
    table.decimal('clicks').notNullable()
    table.string('thumbUrl')
    table.string('redirectUrl').notNullable()
    table.string('code').notNullable()
    table.string('description').notNullable()
    table.string('shortUrl').notNullable()
    table.timestamp('createdAt')
  })
}

export interface Url {
	active: boolean
	shareable: boolean
	user: {
		id: string
		username: string
	}
	id: string
	clicks: number
	thumbUrl: string
	redirectUrl: string
	code: string
	createdAt: Date
	expiresAt: Date
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('urls')
}