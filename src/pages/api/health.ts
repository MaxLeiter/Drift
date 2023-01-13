import { withMethods } from "@lib/api-middleware/with-methods"
import { NextApiRequest, NextApiResponse } from "next"

const handler = async (_: NextApiRequest, res: NextApiResponse) => {
	return res.json({
		status: "UP"
	})
}

export default withMethods(["GET"], handler)