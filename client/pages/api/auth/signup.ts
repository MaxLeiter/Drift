import config from "@lib/config"
import { NextApiRequest, NextApiResponse } from "next"
import prisma from "app/prisma"
import bcrypt, { genSalt } from "bcrypt"
import { generateAndExpireAccessToken } from "@lib/api/generate-access-token"

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { username, password, serverPassword } = req.body
	if (!username || !password) {
		return res.status(400).json({ error: "Missing param" })
	}

	if (
		config.registration_password &&
		serverPassword !== config.registration_password
	) {
		console.log("Registration password mismatch")
		return res.status(401).json({ error: "Unauthorized" })
	}

	const salt = await genSalt(10)
	
	// the first user is the admin
	const isUserAdminByDefault = config.enable_admin && (await prisma.user.count()) === 0
	const userRole = isUserAdminByDefault ? "admin" : "user"

	const user = await prisma.user.create({
		data: {
			username,
			password: await bcrypt.hash(password, salt),
			role: userRole
		},
	})

	const token = await generateAndExpireAccessToken(user)

	return res.status(201).json({ token: token, userId: user.id })
}




