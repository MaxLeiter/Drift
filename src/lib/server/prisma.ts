declare global {
	var prisma: PrismaClient | undefined
}

import config from "@lib/config"
import { Post, PrismaClient, File, User, Prisma } from "@prisma/client"
export type { User, File, Post } from "@prisma/client"

export const prisma =
	global.prisma ||
	new PrismaClient({
		log: ["query"]
	})

if (config.enable_admin) {
	// a prisma middleware for capturing the first user and making them an admin
	prisma.$use(async (params, next) => {
		const result = await next(params)
		if (params.model === "User" && params.action === "create") {
			const users = await prisma.user.findMany()
			if (users.length === 1) {
				await prisma.user.update({
					where: { id: users[0].id },
					data: { role: "admin" }
				})
			}
		}
		return result
	})
}

// prisma.$use(async (params, next) => {
// 	const result = await next(params)
// 	return updateDates(result)
// })

if (process.env.NODE_ENV !== "production") global.prisma = prisma

export type PostWithFiles = Post & {
	files: File[]
}

export type PostWithFilesAndAuthor = PostWithFiles & {
	author: User
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

export async function getPostsByUser(userId: string): Promise<Post[]>
export async function getPostsByUser(
	userId: string,
	includeFiles: true
): Promise<PostWithFiles[]>
export async function getPostsByUser(userId: User["id"], withFiles?: boolean) {
	const posts = await prisma.post.findMany({
		where: {
			authorId: userId
		},
		include: {
			files: withFiles
		},
		orderBy: {
			createdAt: "desc"
		}
	})

	return posts
}

export const getUserById = async (userId: User["id"]) => {
	const user = await prisma.user.findUnique({
		where: {
			id: userId
		},
		select: {
			id: true,
			email: true,
			// displayName: true,
			role: true,
			displayName: true
		}
	})

	return user
}

export const isUserAdmin = async (userId: User["id"]) => {
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

export const getPostById = async (
	postId: Post["id"],
	options?: GetPostByIdOptions
): Promise<Post | PostWithFiles | PostWithFilesAndAuthor | null> => {
	const post = await prisma.post.findUnique({
		where: {
			id: postId
		},
		...options
	})

	return post
}

export const getAllPosts = async ({
	withFiles = false,
	withAuthor = false,
	take = 100,
	...rest
}: {
	withFiles?: boolean
	withAuthor?: boolean
} & Prisma.PostFindManyArgs = {}): Promise<
	Post[] | PostWithFiles[] | PostWithFilesAndAuthor[]
> => {
	const posts = await prisma.post.findMany({
		include: {
			files: withFiles,
			author: withAuthor
		},
		// TODO: optimize which to grab
		take,
		...rest
	})

	return posts as typeof withFiles extends true
		? typeof withAuthor extends true
			? PostWithFilesAndAuthor[]
			: PostWithFiles[]
		: Post[]
}

export type UserWithPosts = User & {
	posts: Post[]
}

export const getAllUsers = async () => {
	const users = await prisma.user.findMany({
		select: {
			id: true,
			email: true,
			role: true,
			displayName: true,
			posts: true,
			createdAt: true
		}
	})

	return users as UserWithPosts[]
}

export const searchPosts = async (
	query: string,
	{
		withFiles = false,
		userId,
		publicOnly
	}: {
		withFiles?: boolean
		userId?: User["id"]
		publicOnly?: boolean
	} = {}
): Promise<PostWithFiles[]> => {
	const posts = await prisma.post.findMany({
		where: {
			OR: [
				{
					title: {
						search: query
					},
					authorId: userId,
					visibility: publicOnly ? "public" : undefined
				},
				{
					files: {
						some: {
							content: {
								search: query
							},
							userId: userId
						}
					},
					visibility: publicOnly ? "public" : undefined
				}
			]
		},
		include: {
			files: withFiles
		}
	})

	return posts as PostWithFiles[]
}
