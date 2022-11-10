import config from "@lib/config"
import { User } from "@prisma/client"
import prisma from "app/prisma"
import { sign } from "jsonwebtoken"

export async function generateAccessToken(user: User) {
	const token = sign({ id: user.id }, config.jwt_secret, { expiresIn: "2d" })

	await prisma.authTokens.create({
		data: {
			userId: user.id,
			token: token
		}
	})

    // TODO: set expiredReason?
	prisma.authTokens.deleteMany({
		where: {
			userId: user.id,
			token: {
				not: token
			}
		}
	})

	return token
}
