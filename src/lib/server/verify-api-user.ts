import { NextApiRequest, NextApiResponse } from "next"
import { unstable_getServerSession } from "next-auth"
import { authOptions } from "./auth"
import { parseQueryParam } from "./parse-query-param"
import { prisma } from "./prisma"

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

	const session = await unstable_getServerSession(req, res, authOptions)
	if (!session) {
		return null
	}

	if (session.user.id !== userId) {
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
			userId: true
		}
	})

	return user?.userId
}
