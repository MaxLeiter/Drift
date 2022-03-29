import { Router } from "express"
import { genSalt, hash, compare } from "bcryptjs"
import { User } from "@lib/models/User"
import { sign } from "jsonwebtoken"
import config from "@lib/config"
import jwt from "@lib/middleware/jwt"
import { celebrate, Joi } from "celebrate"

const NO_EMPTY_SPACE_REGEX = /^\S*$/

export const requiresServerPassword =
	(process.env.MEMORY_DB || process.env.NODE_ENV === "production") &&
	!!process.env.REGISTRATION_PASSWORD
console.log(`Registration password required: ${requiresServerPassword}`)

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
		if (
			!serverPassword ||
			process.env.REGISTRATION_PASSWORD !== serverPassword
		) {
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
				role: (!!process.env.MEMORY_DB && process.env.ENABLE_ADMIN && count === 0) ? "admin" : "user"
			}

			const created_user = await User.create(user)

			const token = generateAccessToken(created_user.id)

			res.status(201).json({ token: token, userId: created_user.id })
		} catch (e) {
			next(e)
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
				const token = generateAccessToken(user.id)
				res.status(200).json({ token: token, userId: user.id })
			} else {
				throw errorToThrow
			}
		} catch (e) {
			next(e)
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

function generateAccessToken(id: string) {
	return sign({ id: id }, config.jwt_secret, { expiresIn: "2d" })
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
