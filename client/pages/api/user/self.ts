import { getCurrentUser } from "@lib/server/session"
import { NextApiRequest, NextApiResponse } from "next"


export default async function handler(
	_: NextApiRequest,
	res: NextApiResponse
): Promise<any> {
	const error = () =>
		res.status(401).json({
			message: "Unauthorized"
		})
	try {
		const user = await getCurrentUser()

		if (!user) {
			return error()
		}
		return res.json(user)
	} catch (e) {
		console.warn(`/api/user/self:`, e)
		return error()
	}
}
