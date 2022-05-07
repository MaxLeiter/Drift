import config from "@lib/config"
import { NextFunction, Request, Response } from "express"

export default function secretKey(
	req: Request,
	res: Response,
	next: NextFunction
) {
	if (!(req.headers && req.headers["x-secret-key"])) {
		return res.sendStatus(401)
	}

	const requestKey = req.headers["x-secret-key"]
	if (requestKey !== config.secret_key) {
		return res.sendStatus(401)
	}
	next()
}
