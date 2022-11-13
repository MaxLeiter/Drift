import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@lib/server/prisma"
import { parseQueryParam } from "@lib/server/parse-query-param"
import { withMethods } from "@lib/api-middleware/with-methods"

const getRawFile = async (req: NextApiRequest, res: NextApiResponse) => {
	const file = await prisma.file.findUnique({
		where: {
			id: parseQueryParam(req.query.id)
		}
	})

	if (!file) {
		return res.status(404).end()
	}

	res.setHeader("Content-Type", "text/plain")
	res.setHeader("Cache-Control", "public, max-age=4800")
	res.status(200).write(file.html)
	res.end()
}

export default withMethods(["GET"], getRawFile)
