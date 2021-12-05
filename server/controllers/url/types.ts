export interface Url {
	active: boolean
	shareable: boolean
	userId: string
	categoryId?: string
	shortUrl: string
	description: string
	id: string
	clicks: number
	thumbUrl?: string
	redirectUrl: string
	code: string
	createdAt: Date
	expiresAt: Date
}