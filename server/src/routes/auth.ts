import { Router } from "express"
import { genSalt, hash, compare } from "bcryptjs"
import { User } from "@lib/models/User"
import { AuthToken } from "@lib/models/AuthToken"
import { sign, verify } from "jsonwebtoken"
import config from "@lib/config"
import jwt, { UserJwtRequest } from "@lib/middleware/jwt"
import { celebrate, Joi } from "celebrate"
import secretKey from "@lib/middleware/secret-key"

const NO_EMPTY_SPACE_REGEX = /^\S*$/

// we require a server password if the password is set and we're in production
export const requiresServerPassword =
	config.registration_password.length > 0 && config.is_production
if (requiresServerPassword) console.log(`Registration password enabled.`)

export const auth = Router()

const validateAuthPayload = (
	username: string,
	password: string,
	serverPassword?: string
): void => {
	if (!NO_EMPTY_SPACE_REGEX.test(username) || password.length < 6) {
		throw new Error("Authentication data does not fulfill requirements")
	}

	if (requiresServerPassword) {
		if (!serverPassword || config.registration_password !== serverPassword) {
			throw new Error(
				"Server password is incorrect. Please contact the server administrator."
			)
		}
	}
}

auth.post(
	"/signup",
	celebrate({
		body: {
			username: Joi.string().required(),
			password: Joi.string().required(),
			serverPassword: Joi.string().required().allow("", null)
		}
	}),
	async (req, res, next) => {
		try {
			validateAuthPayload(
				req.body.username,
				req.body.password,
				req.body.serverPassword
			)
			const username = req.body.username.toLowerCase()

			const existingUser = await User.findOne({
				where: { username: username }
			})

			if (existingUser) {
				throw new Error("Username already exists")
			}

			const salt = await genSalt(10)
			const { count } = await User.findAndCountAll()

			const user = {
				username: username as string,
				password: await hash(req.body.password, salt),
				role: config.enable_admin && count === 0 ? "admin" : "user"
			}

			const created_user = await User.create(user)

			const token = generateAccessToken(created_user)

			res.status(201).json({ token: token, userId: created_user.id })
		} catch (e) {
			res.status(401).json({
				error: {
					message: e.message
				}
			})
		}
	}
)

auth.post(
	"/signin",
	celebrate({
		body: {
			username: Joi.string().required(),
			password: Joi.string().required(),
			serverPassword: Joi.string().required().allow("", null)
		}
	}),
	async (req, res, next) => {
		const error = "User does not exist or password is incorrect"
		const errorToThrow = new Error(error)
		try {
			if (!req.body.username || !req.body.password) {
				throw errorToThrow
			}

			const username = req.body.username.toLowerCase()
			const user = await User.findOne({ where: { username: username } })
			if (!user) {
				throw errorToThrow
			}

			const password_valid = await compare(req.body.password, user.password)
			if (password_valid) {
				const token = generateAccessToken(user)
				res.status(200).json({ token: token, userId: user.id })
			} else {
				throw errorToThrow
			}
		} catch (e) {
			res.status(401).json({
				error: {
					message: error
				}
			})
		}
	}
)

auth.get("/requires-passcode", async (req, res, next) => {
	if (requiresServerPassword) {
		res.status(200).json({ requiresPasscode: true })
	} else {
		res.status(200).json({ requiresPasscode: false })
	}
})

/**
 * Creates an access token, stores it in AuthToken table, and returns it
 */
function generateAccessToken(user: User) {
	const token = sign({ id: user.id }, config.jwt_secret, { expiresIn: "2d" })
	const authToken = new AuthToken({
		userId: user.id,
		token: token
	})
	authToken.save()

	return token
}

auth.get("/verify-token", jwt, async (req, res, next) => {
	try {
		res.status(200).json({
			message: "You are authenticated"
		})
	} catch (e) {
		next(e)
	}
})

auth.post("/signout", secretKey, async (req, res, next) => {
	try {
		const authHeader = req.headers["authorization"]
		const token = authHeader?.split(" ")[1]
		let reason = ""
		if (token == null) return res.sendStatus(401)

		verify(token, config.jwt_secret, async (err: any, user: any) => {
			if (err) {
				reason = "Token expired"
			} else if (user) {
				reason = "User signed out"
			} else {
				reason = "Unknown"
			}

			// find and destroy the AuthToken + set the reason
			const authToken = await AuthToken.findOne({ where: { token: token } })
			if (authToken == null) {
				res.sendStatus(401)
			} else {
				authToken.expiredReason = reason
				authToken.save()
				authToken.destroy()
			}

			req.headers["authorization"] = ""
			res.status(201).json({
				message: "You are now logged out",
				token,
				reason
			})
		})
	} catch (e) {
		next(e)
	}
})

auth.put("/change-password",
	jwt,
	celebrate({
		body: {
			oldPassword: Joi.string().required().min(6).max(128),
			newPassword: Joi.string().required().min(6).max(128)
		}
	}),
	async (req: UserJwtRequest, res, next) => {
		try {
			const user = await User.findOne({ where: { id: req.user?.id } })
			if (!user) {
				return res.sendStatus(401)
			}

			const password_valid = await compare(req.body.oldPassword, user.password)
			if (!password_valid) {
				res.status(401).json({
					error: "Old password is incorrect"
				})
			}

			const salt = await genSalt(10)
			user.password = await hash(req.body.newPassword, salt)
			user.save()

			res.status(200).json({
				message: "Password changed"
			})
		} catch (e) {
			next(e)
		}
	}
)
