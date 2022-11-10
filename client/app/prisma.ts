import { Post, PrismaClient, File, User } from "@prisma/client"

const prisma = new PrismaClient()

export default prisma

export type { User, AuthTokens, File, Post } from "@prisma/client"

export type PostWithFiles = Post & {
	files: File[]
}

export const getFilesForPost = async (postId: string) => {
	const files = await prisma.file.findMany({
		where: {
			postId
		}
	})

	return files
}

export const getPostWithFiles = async (
	postId: string
): Promise<PostWithFiles | undefined> => {
	const post = await prisma.post.findUnique({
		where: {
			id: postId
		}
	})

	if (!post) {
		return undefined
	}

	const files = await getFilesForPost(postId)

	if (!files) {
		return undefined
	}

	return {
		...post,
		files
	}
}

export async function getPostsByUser(userId: string): Promise<Post[]>
export async function getPostsByUser(
	userId: string,
	includeFiles: true
): Promise<PostWithFiles[]>
export async function getPostsByUser(userId: User["id"], withFiles?: boolean) {
	const sharedOptions = {
		take: 20,
		orderBy: {
			createdAt: "desc" as const
		}
	}

	const posts = await prisma.post.findMany({
		where: {
			authorId: userId
		},
		...sharedOptions
	})

	if (withFiles) {
		return Promise.all(
			posts.map(async (post) => {
				const files = await prisma.file.findMany({
					where: {
						postId: post.id
					},
					...sharedOptions
				})

				return {
					...post,
					files
				}
			})
		)
	}

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
			displayName: true,
			role: true,
			username: true
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
