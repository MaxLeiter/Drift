import { NextApiRequest, NextApiResponse } from "next"
import prisma from "@lib/server/prisma"
import bcrypt from "bcrypt"
import { signin } from "@lib/server/signin"
import { setCookie } from "cookies-next"
import { TOKEN_COOKIE_NAME, USER_COOKIE_NAME } from "@lib/constants"

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { username, password } = req.body
	if (!username || !password) {
		return res.status(400).json({ error: "Missing param" })
	}

	const user = await prisma.user.findFirst({
		where: {
			username
		}
	})

	if (!user || !user.password) {
		return res.status(401).json({ error: "Unauthorized" })
	}

	const isPasswordValid = await bcrypt.compare(password, user.password)
	if (!isPasswordValid) {
		return res.status(401).json({ error: "Unauthorized" })
	}

	const token = await signin(user.id, req, res)
	setCookie(TOKEN_COOKIE_NAME, token, {
		path: "/",
		maxAge: 60 * 60 * 24 * 7, // 1 week
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		req,
		res
	})
	setCookie(USER_COOKIE_NAME, user.id, {
		path: "/",
		maxAge: 60 * 60 * 24 * 7, // 1 week
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		req,
		res
	})

	return res.status(201).json({ token: token, userId: user.id })
}
