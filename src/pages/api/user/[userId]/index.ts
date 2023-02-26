import { getUserById } from "@lib/server/prisma"
import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "src/lib/server/prisma"
import { withMethods } from "@lib/api-middleware/with-methods"
import { getSession } from "next-auth/react"
import { verifyApiUser } from "@lib/server/verify-api-user"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const userId = await verifyApiUser(req, res)

	if (!userId) {
		return res.status(400).json({ error: "Missing userId or auth token" })
	}

	const [session, user] = await Promise.all([
		// TODO; this call is duplicated in veryfiyApiUser
		getSession({ req }),
		getUserById(userId)
	])

	const currUser = session?.user

	switch (req.method) {
		case "PUT": {
			const { displayName } = req.body
			const updatedUser = await prisma.user.update({
				where: {
					id: userId
				},
				data: {
					displayName
					// bio
				}
			})

			return res.json({
				id: updatedUser.id,
				name: updatedUser.displayName
				// bio: updatedUser.bio
			})
		}
		case "GET":
			return res.json({
				...currUser,
				displayName: user?.displayName
			})
		case "DELETE":
			if (currUser?.role !== "admin") {
				return res.status(403).json({ message: "Unauthorized" })
			}

			await deleteUser(userId)
			break
		default:
			return res.status(405).json({ message: "Method not allowed" })
	}
}

/**
 * @description Deletes a user and all of their posts, files, and accounts
 * @warning This function does not perform any authorization checks
 */
export async function deleteUser(id: string | undefined) {
	// first delete all of the user's posts
	await prisma.post.deleteMany({
		where: {
			authorId: id
		}
	})

	await prisma.user.delete({
		where: {
			id
		},
		include: {
			posts: true,
			accounts: true,
			sessions: true
		}
	})
}

export default withMethods(["GET", "PUT", "DELETE"], handler)
