import { withMethods } from "@lib/api-middleware/with-methods"
import { parseQueryParam } from "@lib/server/parse-query-param"
import { searchPosts } from "@lib/server/prisma"
import { NextApiRequest, NextApiResponse } from "next"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { q, userId } = req.query

	const query = parseQueryParam(q)
	if (!query) {
		res.status(400).json({ error: "Invalid query" })
		return
	}

	try {
		const posts = await searchPosts(query, {
            userId: parseQueryParam(userId),
        })

		res.status(200).json(posts)
	} catch (err) {
		console.error(err)
		res.status(500).json({ error: "Internal server error" })
	}
}

export default withMethods(["GET"], handler)
