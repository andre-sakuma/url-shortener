export interface User {
	id: string
	username: string
	email: string
	password: string
	createdAt: Date
	active: boolean
	isAdmin: boolean
}