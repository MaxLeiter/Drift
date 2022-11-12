declare global {
	var prisma: PrismaClient | undefined
}

import config from "@lib/config"
import { Post, PrismaClient, File, User } from "@prisma/client"
import { generateAndExpireAccessToken } from "./generate-access-token"

const prisma = new PrismaClient()

export default prisma

// https://next-auth.js.org/adapters/prisma
const client = globalThis.prisma || prisma
if (process.env.NODE_ENV !== "production") globalThis.prisma = client

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

/**
 * When passed in a postId, fetches the post and then the files.
 * If passed a Post, it will fetch the files
 * @param postIdOrPost 		Post or postId
 * @returns Promise<PostWithFiles>
 */
export async function getPostWithFiles(postId: string): Promise<PostWithFiles>
export async function getPostWithFiles(postObject: Post): Promise<PostWithFiles>
export async function getPostWithFiles(
	postIdOrObject: string | Post
): Promise<PostWithFiles | undefined> {
	let post: Post | null
	if (typeof postIdOrObject === "string") {
		post = await prisma.post.findUnique({
			where: {
				id: postIdOrObject
			}
		})
	} else {
		post = postIdOrObject
	}

	if (!post) {
		return undefined
	}

	const files = await getFilesForPost(post.id)

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
	const posts = await prisma.post.findMany({
		where: {
			authorId: userId
		}
	})

	if (withFiles) {
		const postsWithFiles = await Promise.all(
			posts.map(async (post) => {
				const files = await getPostWithFiles(post)
				return {
					...post,
					files
				}
			})
		)

		return postsWithFiles
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
			// displayName: true,
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

export const createUser = async (username: string, password: string, serverPassword?: string) => {
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

	// const salt = await genSalt(10)
	
	// the first user is the admin
	const isUserAdminByDefault = config.enable_admin && (await prisma.user.count()) === 0
	const userRole = isUserAdminByDefault ? "admin" : "user"

	// const user = await prisma.user.create({
	// 	data: {
	// 		username,
	// 		password: await bcrypt.hash(password, salt),
	// 		role: userRole,
	// 	},
	// })

	// const token = await generateAndExpireAccessToken(user.id)

	return {
		// user,
		// token
	}
}

export const getPostById = async (postId: Post["id"]) => {
	const post = await prisma.post.findUnique({
		where: {
			id: postId
		}
	})

	return post
}
