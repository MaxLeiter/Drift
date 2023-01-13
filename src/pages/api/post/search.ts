import { withMethods } from "@lib/api-middleware/with-methods"
import { parseQueryParam } from "@lib/server/parse-query-param"
import { searchPosts } from "@lib/server/prisma"
import { verifyApiUser } from "@lib/server/verify-api-user"
import { NextApiRequest, NextApiResponse } from "next"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const query = req.query
	const q = parseQueryParam(query.q)
	const publicSearch = parseQueryParam(query.public)
	const searchQuery = parseQueryParam(q)

	console.log(
		"searchQuery",
		searchQuery,
		"publicSearch",
		publicSearch,
		"userId",
		query.userId
	)
	if (!searchQuery) {
		res.status(400).json({ error: "Invalid query" })
		return
	}

	if (publicSearch) {
		const posts = await searchPosts(searchQuery)
		return res.json(posts)
	} else {
		const userId = await verifyApiUser(req, res)
		if (!userId) {
			res.status(401).json({ error: "Unauthorized" })
			return
		}

		const posts = await searchPosts(searchQuery, {
			userId,
			withFiles: true,
			publicOnly: false
		})

		return res.json(posts)
	}
}

export default withMethods(["GET"], handler)
