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