import prisma from "app/prisma"

export const getPostsByUser = async (userId: number) => {
	const posts = await prisma.post.findMany({
		where: {
			
		}
	})

	return posts
}
