import { Post, PrismaClient, File } from "@prisma/client"

const prisma = new PrismaClient()

export default prisma

export type {
	User,
	AuthTokens,
	File,
	Post,
	PostToAuthors
} from "@prisma/client"

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
