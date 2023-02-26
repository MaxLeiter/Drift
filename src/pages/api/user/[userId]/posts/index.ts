import { verifyApiUser } from "@lib/server/verify-api-user"
import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@lib/server/prisma"

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const userId = await verifyApiUser(req, res)
	if (!userId) {
		return res.status(400).json({ error: "Missing userId or auth token" })
	}

	const userPosts = await prisma.post.findMany({
		where: {
			authorId: userId
		},
		select: {
			id: true,
			title: true,
			files: {
				select: {
					id: true,
					content: true,
					title: true,
					sha: true,
					updatedAt: true,
					createdAt: true,
					deletedAt: true
				}
			},
			createdAt: true,
			updatedAt: true,
			deletedAt: true,
			authorId: true,
			parentId: true,
			description: true,
			visibility: true
		}
	})

	res.status(200).json(userPosts)
}
