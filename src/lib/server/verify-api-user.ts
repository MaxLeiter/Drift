import { NextApiRequest, NextApiResponse } from "next"
import { parseQueryParam } from "./parse-query-param"
import { prisma } from "./prisma"
import { getCurrentUser } from "./session"

/**
 * verifyApiUser checks for a `userId` param. If it exists, it checks that the
 * user is authenticated with Next-Auth and that the user id matches the param. If the param
 * does not exist, it checks for an auth token in the request headers.
 *
 * @param req
 * @param res
 * @returns the user id if the user is authenticated, null otherwise
 */
export const verifyApiUser = async (
	req: NextApiRequest,
	res: NextApiResponse
) => {
	const userId = parseQueryParam(req.query.userId)

	if (!userId) {
		return parseAndCheckAuthToken(req)
	}

	const user = await getCurrentUser({ req, res })

	if (user?.id !== userId) {
		return null
	}

	return userId
}

const parseAndCheckAuthToken = async (req: NextApiRequest) => {
	const token = req.headers.authorization?.split(" ")[1]
	if (!token) {
		return null
	}

	const user = await prisma.apiToken.findUnique({
		where: {
			token
		},
		select: {
			userId: true,
			expiresAt: true
		}
	})

	if (!user) {
		return null
	}

	if (user.expiresAt < new Date()) {
		return null
	}

	return user?.userId
}
