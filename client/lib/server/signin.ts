import { USER_COOKIE_NAME, TOKEN_COOKIE_NAME } from "@lib/constants"
import { User } from "@lib/server/prisma"
import { setCookie } from "cookies-next"
import { NextApiRequest, NextApiResponse } from "next"
import { generateAndExpireAccessToken } from "./generate-access-token"

export const signin = async (
	userId: User["id"],
	req: NextApiRequest,
	res: NextApiResponse
) => {
	const token = await generateAndExpireAccessToken(userId)
	setCookie(USER_COOKIE_NAME, userId, {
		maxAge: 30 * 24 * 60 * 60, // 30 days,
		req,
		res
	})
	setCookie(TOKEN_COOKIE_NAME, token, {
		maxAge: 30 * 24 * 60 * 60, // 30 days
		req,
		res
	})

	return token
}
