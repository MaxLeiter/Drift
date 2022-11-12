declare global {
	var prisma: PrismaClient | undefined
}

import config from "@lib/config"
import { Post, PrismaClient, File, User } from "@prisma/client"

const prisma = new PrismaClient()

// we want to update iff they exist the createdAt/updated/expired/deleted items
// the input could be an array, in which case we'd check each item in the array
// if it's an object, we'd check that object
// then we return the changed object or array

const updateDateForItem = (item: any) => {
	if (item.createdAt) {
		item.createdAt = item.createdAt.toISOString()
	}
	if (item.updatedAt) {
		item.updatedAt = item.updatedAt.toISOString()
	}
	if (item.expiresAt) {
		item.expiresAt = item.expiresAt.toISOString()
	}
	if (item.deletedAt) {
		item.deletedAt = item.deletedAt.toISOString()
	}
	return item
}

const updateDates = (input: any) => {
	if (Array.isArray(input)) {
		return input.map((item) => updateDateForItem(item))
	} else {
		return updateDateForItem(input)
	}
}

prisma.$use(async (params, next) => {
	const result = await next(params)
	return updateDates(result)
})

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


	const isUserAdminByDefault =
		config.enable_admin && (await prisma.user.count()) === 0
	const userRole = isUserAdminByDefault ? "admin" : "user"

	return {
		// user,
		// token
	}
}

export const getPostById = async (postId: Post["id"], withFiles = false) => {
	console.log("getPostById", postId)
	const post = await prisma.post.findUnique({
		where: {
			id: postId
		},
		include: {
			files: withFiles
		}
	})

	return post
}
