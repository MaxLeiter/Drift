// user.get("/self", jwt, async (req: UserJwtRequest, res, next) => {
// 	const error = () =>
// 		res.status(401).json({
// 			message: "Unauthorized"
// 		})

import { USER_COOKIE_NAME } from "@lib/constants"
import { getUserById } from "@lib/server/prisma"
import { getCookie } from "cookies-next"
import { NextApiRequest, NextApiResponse } from "next"

// 	try {
// 		if (!req.user) {
// 			return error()
// 		}

// 		const user = await User.findByPk(req.user?.id, {
// 			attributes: {
// 				exclude: ["password"]
// 			}
// 		})
// 		if (!user) {
// 			return error()
// 		}
// 		res.json(user)
// 	} catch (error) {
// 		next(error)
// 	}
// })

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
): Promise<any> {
	const error = () =>
		res.status(401).json({
			message: "Unauthorized"
		})

	const userId = String(
		getCookie(USER_COOKIE_NAME, {
			req,
			res
		})
	)

	if (!userId) {
		return error()
	}

	try {
		const user = await getUserById(userId)

		if (!user) {
			return error()
		}
		return res.json(user)
	} catch (e) {
		console.warn(`/api/user/self:`, e)
		return error()
	}
}
