import { withMethods } from "@lib/api-middleware/with-methods"
import { parseQueryParam } from "@lib/server/parse-query-param"
import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "lib/server/prisma"
import { getSession } from "next-auth/react"
import { deleteUser } from "../user/[id]"

const actions = [
	"user",
	"post",
	"users",
	"posts",
	"set-role",
	"delete-user",
	"delete-post"
] as const

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { action: requestedAction } = req.query
	const action = parseQueryParam(requestedAction) as typeof actions[number]

	if (!action || !actions.includes(action)) {
		res.status(400).json({ error: "Invalid action" })
		return
	}

	const session = await getSession({ req })
	const id = session?.user?.id

	const isAdmin = await prisma.user
		.findUnique({
			where: {
				id
			},
			select: {
				role: true
			}
		})
		.then((user) => user?.role === "admin")

	if (!isAdmin) {
		return res.status(403).json({ error: "Not authorized" })
	}

	switch (req.method) {
		case "GET":
			switch (action) {
				case "users":
					const users = await prisma.user.findMany()
					return res.status(200).json(users)
				case "posts":
					const posts = await prisma.post.findMany()
					return res.status(200).json(posts)
				case "user":
					const { id: userId } = req.query
					const user = await prisma.user.findUnique({
						where: {
							id: parseQueryParam(userId)
						}
					})
					return res.status(200).json(user)
				case "post":
					const { id: postId } = req.query
					const post = await prisma.post.findUnique({
						where: {
							id: parseQueryParam(postId)
						}
					})
					return res.status(200).json(post)
			}
			break
		case "PATCH":
			switch (action) {
				case "set-role":
					const { userId, role } = req.body
					if (!userId || !role || role !== "admin" || role !== "user") {
						return res.status(400).json({ error: "Invalid request" })
					}

					const user = await prisma.user.update({
						where: { id: userId },
						data: {
							role: role
						}
					})

					return res.status(200).json(user)
			}
			break
		case "DELETE":
			switch (action) {
				case "delete-user":
					const { userId } = req.body
					if (!userId) {
						return res.status(400).json({ error: "Invalid request" })
					}

					await deleteUser(userId)

					return res.status(200).send("User deleted")
				case "delete-post":
					const { postId } = req.body
					if (!postId) {
						return res.status(400).json({ error: "Invalid request" })
					}

					const post = await prisma.post.delete({
						where: { id: postId }
					})

					return res.status(200).json(post)
			}
			break
	}
}

export default withMethods(["GET", "PATCH", "DELETE"], handler)
