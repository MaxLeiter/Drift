import config from "@lib/config"
import { NextApiRequest, NextApiResponse } from "next"

export const getRequiresPasscode = async () => {
	const requiresPasscode = Boolean(config.registration_password)
	return requiresPasscode
}

const handleRequiresPasscode = async (
	_: NextApiRequest,
	res: NextApiResponse
) => {
	return res.json({ requiresPasscode: await getRequiresPasscode() })
}

export default async function requiresPasscode(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { slug } = req.query

	if (!slug || Array.isArray(slug)) {
		return res.status(400).json({ error: "Missing param" })
	}

	switch (req.method) {
		case "GET":
			if (slug === "requires-passcode") {
				return handleRequiresPasscode(req, res)
			}

			return res.status(404).json({ error: "Not found" })
		default:
			return res.status(405).json({ error: "Method not allowed" })
	}
}
