declare global {
	// eslint-disable-next-line no-var
	var prisma: PrismaClient | undefined
}

import config from "@lib/config"
import {
	Post as ServerPost,
	PrismaClient,
	User as ServerUser,
	Prisma,
	File as ServerFile
} from "@prisma/client"
import * as crypto from "crypto"
import { cache } from "react"
export type {
	User as ServerUser,
	File as ServerFile,
	Post as ServerPost
} from "@prisma/client"
export const prisma =
	global.prisma ||
	new PrismaClient({
		log: ["query"]
	})

// prisma.$use(async (params, next) => {
// 	const result = await next(params)
// 	return updateDates(result)
// })

if (process.env.NODE_ENV !== "production") global.prisma = prisma

const postWithFiles = Prisma.validator<Prisma.PostArgs>()({
	include: {
		files: true
	}
})

const postWithAuthor = Prisma.validator<Prisma.PostArgs>()({
	include: {
		author: true
	}
})

const postWithFilesAndAuthor = Prisma.validator<Prisma.PostArgs>()({
	include: {
		files: true,
		author: true
	}
})

export type ServerPostWithFiles = Prisma.PostGetPayload<typeof postWithFiles>
export type ServerPostWithAuthor = Prisma.PostGetPayload<typeof postWithAuthor>
export type ServerPostWithFilesAndAuthor = Prisma.PostGetPayload<
	typeof postWithFilesAndAuthor
>

export type PostWithFiles = Omit<
	ServerPostWithFiles,
	"files" | "updatedAt" | "createdAt" | "deletedAt" | "expiresAt"
> & {
	files: (Omit<
		ServerPostWithFiles["files"][number],
		"content" | "html" | "updatedAt" | "createdAt" | "deletedAt"
	> & {
		content: string
		html: string
		updatedAt?: string
		createdAt: string
		deletedAt?: string
	})[]
	updatedAt?: string
	createdAt: string
	deletedAt?: string
	expiresAt?: string
}

export type PostWithFilesAndAuthor = Omit<
	ServerPostWithFilesAndAuthor,
	"files" | "updatedAt" | "createdAt" | "deletedAt" | "expiresAt" | "author"
> & {
	files: (Omit<
		ServerPostWithFilesAndAuthor["files"][number],
		"content" | "html" | "updatedAt" | "createdAt" | "deletedAt"
	> & {
		content: string
		html: string
		updatedAt?: string
		createdAt: string
		deletedAt?: string
	})[]

	author: Omit<
		ServerPostWithFilesAndAuthor["author"],
		"createdAt" | "updatedAt"
	> & {
		createdAt: string
		updatedAt: string
	}

	updatedAt?: string
	createdAt: string
	deletedAt?: string
	expiresAt?: string
}

export function serverPostToClientPost(
	post: ServerPostWithFiles | ServerPostWithFilesAndAuthor
): PostWithFilesAndAuthor | PostWithFiles {
	let result: PostWithFiles | PostWithFilesAndAuthor = {
		...post,
		files: post.files?.map((file) => ({
			...file,
			content: file.content?.toString("utf-8"),
			html: file.html?.toString("utf-8"),
			updatedAt: file.updatedAt?.toISOString(),
			createdAt: file.createdAt?.toISOString(),
			deletedAt: file.deletedAt?.toISOString()
		})),
		updatedAt: post.updatedAt?.toISOString(),
		createdAt: post.createdAt?.toISOString(),
		deletedAt: post.deletedAt?.toISOString(),
		expiresAt: post.expiresAt?.toISOString()
	}

	if ("author" in post && post.author) {
		result = {
			...result,
			author: {
				...post.author,
				createdAt: post.author.createdAt?.toISOString(),
				updatedAt: post.author.updatedAt?.toISOString()
			}
		}
	}

	return result
}

export const getFilesForPost = async (postId: string) => {
	const files = await prisma.file.findMany({
		where: {
			postId
		}
	})

	return files
}

export async function getFilesByPost(postId: string) {
	const files = await prisma.file.findMany({
		where: {
			postId
		}
	})

	return files
}

export async function getPostsByUser(userId: string): Promise<ServerPost[]>
export async function getPostsByUser(
	userId: string,
	includeFiles: true
): Promise<ServerPostWithFiles[]>
export async function getPostsByUser(
	userId: ServerUser["id"],
	withFiles?: boolean
) {
	const posts = await prisma.post.findMany({
		where: {
			authorId: userId
		},
		orderBy: {
			createdAt: "desc"
		},
		select: {
			id: true,
			title: true,
			createdAt: true,
			updatedAt: true,
			authorId: true,
			visibility: true,
			...(withFiles && {
				files: {
					select: {
						id: true,
						title: true,
						createdAt: true
					}
				}
			})
		}
	})

	return posts
}

export const getUserById = async (
	userId: ServerUser["id"],
	selects?: Prisma.UserFindUniqueArgs["select"]
) => {
	const user = await prisma.user.findUnique({
		where: {
			id: userId
		},
		select: {
			id: true,
			email: true,
			// displayName: true,
			role: true,
			displayName: true,
			...selects
		}
	})

	return user
}

export const isUserAdmin = async (userId: ServerUser["id"]) => {
	const user = await prisma.user.findUnique({
		where: {
			id: userId
		},
		select: {
			role: true
		}
	})

	return user?.role?.toLowerCase() === "admin"
}

export const createUser = async (
	username: string,
	password: string,
	serverPassword?: string
) => {
	if (!username || !password) {
		throw new Error("Missing param")
	}

	if (
		config.registration_password &&
		serverPassword !== config.registration_password
	) {
		console.log("Registration password mismatch")
		throw new Error("Wrong registration password")
	}

	return {
		// user,
		// token
	}
}

// all of prisma.post.findUnique
type GetPostByIdOptions = Pick<
	Prisma.PostFindUniqueArgs,
	"include" | "rejectOnNotFound" | "select"
>

export const getPostById = cache(
	async (postId: ServerPost["id"], options?: GetPostByIdOptions) => {
		const post = await prisma.post.findUnique({
			where: {
				id: postId
			},
			...options
		})

		return post
	}
)

export const getAllPosts = cache(
	async (
		options?: Prisma.PostFindManyArgs
	): Promise<
		ServerPost[] | ServerPostWithFiles[] | ServerPostWithFilesAndAuthor[]
	> => {
		const posts = await prisma.post.findMany(options)
		return posts
	}
)

export const userWithPosts = Prisma.validator<Prisma.UserArgs>()({
	include: {
		posts: true
	}
})

export type UserWithPosts = Prisma.UserGetPayload<typeof userWithPosts>

export const getAllUsers = async (
	options?: Prisma.UserFindManyArgs
): Promise<ServerUser[] | UserWithPosts[]> => {
	const users = (await prisma.user.findMany({
		select: {
			id: true,
			email: true,
			role: true,
			displayName: true,
			posts: true,
			createdAt: true
		},
		...options
	})) as ServerUser[] | UserWithPosts[]

	return users
}

export const searchPosts = async (
	query: string,
	{
		userId
	}: {
		userId?: ServerUser["id"]
	} = {}
): Promise<ServerPostWithFiles[]> => {
	const posts = await prisma.post.findMany({
		where: {
			OR: [
				{
					title: {
						contains: query
					},
					authorId: userId,
					visibility: userId ? undefined : "public"
				},
				{
					files: {
						some: {
							content: {
								in: [Buffer.from(query)]
							}
						}
					},
					visibility: userId ? undefined : "public",
					authorId: userId
				}
			]
		}
	})

	return posts as ServerPostWithFiles[]
}

function generateApiToken() {
	return crypto.randomBytes(32).toString("hex")
}

export const createApiToken = async (
	userId: ServerUser["id"],
	name: string
) => {
	const apiToken = await prisma.apiToken.create({
		data: {
			token: generateApiToken(),
			expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30 * 3),
			user: {
				connect: { id: userId }
			},
			name
		}
	})

	return apiToken
}

export function getFileById(fileId: ServerFile["id"]) {
	return prisma.file.findUnique({
		where: {
			id: fileId
		},
		include: {
			post: {
				select: {
					id: true,
					visibility: true
				}
			}
		}
	})
}
