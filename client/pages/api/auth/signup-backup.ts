import { NextApiRequest, NextApiResponse } from "next"
import { createUser } from "@lib/server/prisma"

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { username, password, serverPassword } = req.body
	const { user, token } = await createUser(username, password, serverPassword)

	return res.status(201).json({ token: token, userId: user.id })
}
