import { withMethods } from "@lib/api-middleware/with-methods"
import { getHtmlFromFile } from "@lib/server/get-html-from-drift-file"
import { parseQueryParam } from "@lib/server/parse-query-param"
import { NextApiRequest, NextApiResponse } from "next"

export default withMethods(
	["POST"],
	async (req: NextApiRequest, res: NextApiResponse) => {
		const body = req.body
		const content = parseQueryParam(body.content)
		const title = parseQueryParam(body.title) || "Untitled"

		if (!content) {
			return res.status(400).json({ error: "Missing content" })
		}

		const renderedHTML = await getHtmlFromFile({
			title,
			content
		})

		res.setHeader("Content-Type", "text/plain")
		res.setHeader("Cache-Control", "public, max-age=4800")
		res.status(200).write(renderedHTML)
		res.end()
		return
	}
)
