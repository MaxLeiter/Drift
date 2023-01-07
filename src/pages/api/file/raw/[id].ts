import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "src/lib/server/prisma"
import { parseQueryParam } from "@lib/server/parse-query-param"

const getRawFile = async (req: NextApiRequest, res: NextApiResponse) => {
	const { id, download } = req.query

	const file = await prisma.file.findUnique({
		where: {
			id: parseQueryParam(id)
		}
	})

	if (!file) {
		return res.status(404).json({ error: "File not found" })
	}

	res.setHeader("Content-Type", "text/plain; charset=utf-8")
	res.setHeader("Cache-Control", "s-maxage=86400")

	const { title, content } = file

	if (download) {
		res.setHeader("Content-Disposition", `attachment; filename="${title}"`)
	} else {
		res.setHeader("Content-Disposition", `inline; filename="${title}"`)
	}

	res.status(200).write(content, "utf-8")
	res.end()
}

export default getRawFile
