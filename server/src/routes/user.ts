import { Router } from "express"
import jwt, { UserJwtRequest } from "@lib/middleware/jwt"
import { User } from "@lib/models/User"
import { celebrate, Joi } from "celebrate"

export const user = Router()

user.get("/self", jwt, async (req: UserJwtRequest, res, next) => {
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

user.put("/profile",
	jwt,
	celebrate({
		body: {
			displayName: Joi.string().optional().allow(""),
			bio: Joi.string().optional().allow(""),
			email: Joi.string().optional().email().allow(""),
		}
	}),
	async (req: UserJwtRequest, res, next) => {
		const error = () =>
			res.status(401).json({
				message: "Unauthorized"
			})

		try {
			if (!req.user) {
				return error()
			}

			const user = await User.findByPk(req.user?.id)
			if (!user) {
				return error()
			}
			console.log(req.body)
			const { displayName, bio, email } = req.body
			const toUpdate = {} as any
			if (displayName) {
				toUpdate.displayName = displayName
			}
			if (bio) {
				toUpdate.bio = bio
			}
			if (email) {
				toUpdate.email = email
			}

			await user.update(toUpdate)
			res.json(user)
		} catch (error) {
			next(error)
		}
	}
)
