import { parseQueryParam } from "@lib/server/parse-query-param"
import { getPostsByUser } from "@lib/server/prisma"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handle(
	req: NextApiRequest,
	res: NextApiResponse
) {
	switch (req.method) {
		case "GET":
			const userId = parseQueryParam(req.query.userId)
			if (!userId) {
				return res.status(400).json({ error: "Missing userId" })
			}

			const posts = await getPostsByUser(userId)
			return res.json(posts)
		default:
			return res.status(405).end()
	}
}
