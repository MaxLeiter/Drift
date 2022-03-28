import { Router } from "express"
import jwt, { UserJwtRequest } from "@lib/middleware/jwt"
import { User } from "@lib/models/User"

export const users = Router()

users.get("/self", jwt, async (req: UserJwtRequest, res, next) => {
	const error = () =>
		res.status(401).json({
			message: "Unauthorized"
		})

	try {
		if (!req.user) {
			return error()
		}

		const user = await User.findByPk(req.user?.id, {
			attributes: {
				exclude: ["password"]
			}
		})
		if (!user) {
			return error()
		}

		res.json(user)
	} catch (error) {
		next(error)
	}
})
