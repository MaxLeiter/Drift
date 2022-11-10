import config from "@lib/config"
import { User } from "@prisma/client"
import prisma from "app/prisma"
import { sign } from "jsonwebtoken"

export async function generateAndExpireAccessToken(userId: User["id"]) {
	const token = sign({ id: userId }, config.jwt_secret, { expiresIn: "2d" })

	await prisma.authTokens.create({
		data: {
			userId: userId,
			token: token
		}
	})

    // TODO: set expiredReason?
	prisma.authTokens.deleteMany({
		where: {
			userId: userId,
			token: {
				not: token
			}
		}
	})

	return token
}
