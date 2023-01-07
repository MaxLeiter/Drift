import { parseQueryParam } from "@lib/server/parse-query-param"
import { NextApiRequest, NextApiResponse } from "next"
import { createApiToken, prisma } from "@lib/server/prisma"
import { verifyApiUser } from "@lib/server/verify-api-user"

export default async function handle(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const userId = await verifyApiUser(req, res)
	if (!userId) {
		return res.status(400).json({ error: "Missing userId or auth token" })
	}

	switch (req.method) {
		case "GET": {
			const tokens = await prisma.apiToken.findMany({
				where: {
					userId
				},
				select: {
					id: true,
					userId: true,
					createdAt: true,
					expiresAt: true,
					name: true
				}
			})

			return res.json(tokens)
		}
		case "POST": {
			const name = parseQueryParam(req.query.name)
			if (!name) {
				return res.status(400).json({ error: "Missing token name" })
			}
			const token = await createApiToken(userId, name)
			return res.json(token)
		}
		case "DELETE": {
			const tokenId = parseQueryParam(req.query.tokenId)
			if (!tokenId) {
				return res.status(400).json({ error: "Missing tokenId" })
			}

			await prisma.apiToken.delete({
				where: {
					id: tokenId
				}
			})

			return res.status(204).end()
		}
		default:
			return res.status(405).end()
	}
}
