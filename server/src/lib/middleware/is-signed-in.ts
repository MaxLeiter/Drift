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

export default async function isSignedIn(
	req: UserJwtRequest,
	res: Response,
	next: NextFunction
) {
	const authHeader = req.headers ? req.headers["authorization"] : undefined
	const token = authHeader && authHeader.split(" ")[1]

	if (config.header_auth && config.header_auth_name) {
		if (!config.header_auth_whitelisted_ips?.includes(req.ip)) {
			console.warn(`IP ${req.ip} is not whitelisted and tried to authenticate with header auth.`)
			return res.sendStatus(401)
		}

		// with header auth, we assume the user is authenticated,
		// but their user may not be created in the database yet.

		let user = await UserModel.findByPk(req.user?.id)
		if (!user) {
			const username = req.header[config.header_auth_name]
			const role = config.header_auth_role ? req.header[config.header_auth_role] || "user" : "user"
			user = new UserModel({
				username,
				role
			})
			await user.save()
			console.log(`Created user ${username} with role ${role} via header auth.`)
		}

		req.user = user
		next()
	} else {
		if (token == null) return res.sendStatus(401)

		const authToken = await AuthToken.findOne({ where: { token: token } })
		if (authToken == null) {
			return res.sendStatus(401)
		}
	
		if (authToken.deletedAt) {
			return res.sendStatus(401).json({
				message: "Token is no longer valid"
			})
		}
	
		jwt.verify(token, config.jwt_secret, async (err: any, user: any) => {
			if (err) {
				if (config.header_auth) {
					// if the token has expired or is invalid, we need to delete it and generate a new one
					authToken.destroy()
					const token = jwt.sign({ id: user.id }, config.jwt_secret, {
						expiresIn: "2d"
					})
					const newToken = new AuthToken({
						userId: user.id,
						token: token
					})
					await newToken.save()
				} else {
					return res.sendStatus(403)
				}
			}
	
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
}
