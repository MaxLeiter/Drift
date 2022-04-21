export type PostVisibility = "unlisted" | "private" | "public" | "protected"

export type Document = {
	title: string
	content: string
	id: string
}

export type File = {
	id: string
	title: string
	content: string
	html: string
	createdAt: string
}

type Files = File[]

export type Post = {
	id: string
	title: string
	description: string
	visibility: PostVisibility
	files?: Files
	createdAt: string
	users?: User[]
	parent?: Pick<Post, "id" | "title" | "visibility" | "createdAt">
	expiresAt: Date | string | null
}

type User = {
	id: string
	username: string
	posts?: Post[]
	role: "admin" | "user" | ""
	createdAt: string
	displayName?: string
	bio?: string
	email?: string
}
