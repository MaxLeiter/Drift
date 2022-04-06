import { AuthToken } from "@lib/models/AuthToken"
import { NextFunction, Request, Response } from "express"
import * as jwt from "jsonwebtoken"
import config from "../config"
import { User as UserModel } from "../models/User"

export interface User {
	id: string
}

export interface UserJwtRequest extends Request {
	user?: User
}

export default async function authenticateToken(
	req: UserJwtRequest,
	res: Response,
	next: NextFunction
) {
	const authHeader = req.headers["authorization"]
	const token = authHeader && authHeader.split(" ")[1]

	if (token == null) return res.sendStatus(401)

	const authToken = await AuthToken.findOne({ where: { token: token } })
	if (authToken == null) {
		return res.sendStatus(401)
	}

	if (authToken.deletedAt) {
		return res.sendStatus(401).json({
			message: "Token is no longer valid",
		})
	}

	jwt.verify(token, config.jwt_secret, async (err: any, user: any) => {
		if (err) return res.sendStatus(403)
		const userObj = await UserModel.findByPk(user.id, {
			attributes: {
				exclude: ["password"]
			}
		})
		if (!userObj) {
			return res.sendStatus(403)
		}
		req.user = user

		next()
	})
}
