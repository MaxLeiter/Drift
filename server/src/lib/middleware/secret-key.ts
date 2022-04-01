import config from "@lib/config"
import { NextFunction, Request, Response } from "express"

export default function authenticateToken(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const requestKey = req.headers["x-secret-key"]
	if (requestKey !== config.secret_key) {
		return res.sendStatus(401)
	}
	next()
}
