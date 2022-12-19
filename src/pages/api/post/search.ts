import { withMethods } from "@lib/api-middleware/with-methods"
import { parseQueryParam } from "@lib/server/parse-query-param"
import { searchPosts, ServerPostWithFiles } from "@lib/server/prisma"
import { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { q, userId } = req.query

	const session = await getSession()

	const query = parseQueryParam(q)
	const user = parseQueryParam(userId)
	if (!query) {
		res.status(400).json({ error: "Invalid query" })
		return
	}

	try {
		let posts: ServerPostWithFiles[]
		if (session?.user.id === user || session?.user.role === "admin") {
			posts = await searchPosts(query, {
				userId: user
			})
		} else {
			posts = await searchPosts(query, {
				userId: user,
				publicOnly: true
			})
		}

		res.status(200).json(posts)
	} catch (err) {
		console.error(err)
		res.status(500).json({ error: "Internal server error" })
	}
}

export default withMethods(["GET"], handler)
