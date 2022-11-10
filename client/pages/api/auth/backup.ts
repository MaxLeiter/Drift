import config from "@lib/config"
import { NextApiRequest, NextApiResponse } from "next"

const handleRequiresPasscode = async (
	req: NextApiRequest,
	res: NextApiResponse
) => {
	const requiresPasscode = Boolean(config.registration_password)
	return res.json({ requiresPasscode })
}

const PATH_TO_HANDLER = {
	"requires-passcode": handleRequiresPasscode
}

// eslint-disable-next-line import/no-anonymous-default-export
export default (req: NextApiRequest, res: NextApiResponse) => {
	const { slug } = req.query

	if (!slug || Array.isArray(slug)) {
		return res.status(400).json({ error: "Missing param" })
	}

	switch (req.method) {
		case "GET":
			if (PATH_TO_HANDLER[slug as keyof typeof PATH_TO_HANDLER]) {
				return PATH_TO_HANDLER[slug as keyof typeof PATH_TO_HANDLER](req, res)
			}
		default:
			return res.status(405).json({ error: "Method not allowed" })
	}
}
