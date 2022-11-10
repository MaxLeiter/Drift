import { NextApiRequest, NextApiResponse } from "next"
import prisma from "app/prisma"
import bcrypt from "bcrypt"
import { signin } from "@lib/api/signin"

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

	if (!user) {
		return res.status(401).json({ error: "Unauthorized" })
	}

	const isPasswordValid = await bcrypt.compare(password, user.password)
	if (!isPasswordValid) {
		return res.status(401).json({ error: "Unauthorized" })
	}

	const token = await signin(user.id, req, res);

	return res.status(201).json({ token: token, userId: user.id })
}
