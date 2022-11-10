import { withJwt } from "@lib/api/jwt"
import config from "@lib/config"
import { NextApiRequest, NextApiResponse } from "next"

const handleSelf = async (
	req: NextApiRequest,
	res: NextApiResponse
) => {
	
}

const PATH_TO_HANDLER = {
	"self": handleRequiresPasscode
}

// eslint-disable-next-line import/no-anonymous-default-export
export default withJwt((req: NextApiRequest, res: NextApiResponse) => {
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
})
