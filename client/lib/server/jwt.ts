// next api route jwt middleware; check if the user has a valid jwt token

import config from "@lib/config"
import { User } from "@prisma/client"
import prisma from "app/prisma"
import * as jwt from "jsonwebtoken"
import next, { NextApiHandler, NextApiRequest, NextApiResponse } from "next"

type ReqWithUser = NextApiRequest & {
	user?: User
}

type WrappedHandler = (req: ReqWithUser, res: NextApiResponse) => Promise<void>

// usage: useJwt(otherHandler)

// we want the usage to be the user writing their API route and exporting it with useJwt(handler)

// uses prisma
export async function withJwt(
	origHandler: NextApiHandler
): Promise<WrappedHandler | void> {
	return async (req: ReqWithUser, res: NextApiResponse) => {
		const authHeader = req ? req.headers["authorization"] : undefined
		const token = authHeader && authHeader.split(" ")[1]

		if (token == null) return res.status(401).send("Unauthorized")

		const authToken = await prisma.authTokens.findUnique({
			// @ts-ignore
			where: { id: token }
		})
		if (authToken == null) {
			return res.status(401).send("Unauthorized")
		}

		if (authToken.deletedAt) {
			return res.status(401).json({
				message: "Token is no longer valid"
			})
		}

		jwt.verify(token, config.jwt_secret, async (err: any, user: any) => {
			if (err) return res.status(403).send("Forbidden")
			const userObj = await prisma.user.findUnique({
				where: { id: user.id },
				select: {
					id: true,
					email: true,
					displayName: true,
					bio: true,
					createdAt: true,
					updatedAt: true,
					deletedAt: true
				}
			})
			if (!userObj) {
				return res.status(403).send("Forbidden")
			}

			;(req as ReqWithUser).user = user
			return origHandler(req, res)
		})
	}
}
