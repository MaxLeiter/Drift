import { parseQueryParam } from "@lib/server/parse-query-param"
import { getUserById } from "@lib/server/prisma"
import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "lib/server/prisma"
import { withMethods } from "@lib/api-middleware/with-methods"
import { getSession } from "next-auth/react"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const id = parseQueryParam(req.query.id)
	if (!id) {
		return res.status(400).json({ error: "Missing id" })
	}

	const user = await getUserById(id)
	const currUser = (await getSession({ req }))?.user

	if (!user) {
		return res.status(404).json({ message: "User not found" })
	}

	if (user.id !== currUser?.id) {
		return res.status(403).json({ message: "Unauthorized" })
	}

	switch (req.method) {
		case "PUT":
			const { displayName } = req.body
			const updatedUser = await prisma.user.update({
				where: {
					id
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
		case "GET":
			return res.json(currUser)
		case "DELETE":
			if (currUser?.role !== "admin" && currUser?.id !== id) {
				return res.status(403).json({ message: "Unauthorized" })
			}

			await deleteUser(id)

		default:
			return res.status(405).json({ message: "Method not allowed" })
	}
}

export default withMethods(["GET", "PUT", "DELETE"], handler)

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
