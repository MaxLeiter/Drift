import getHtmlFromFile from "@lib/server/get-html-from-drift-file"
import { parseUrlQuery } from "@lib/server/parse-url-query"
import prisma from "app/prisma"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	switch (req.method) {
		case "GET":
			const query = req.query
			const fileId = parseUrlQuery(query.fileId)
			const content = parseUrlQuery(query.content)
			const title = parseUrlQuery(query.title)

			if (fileId && (content || title)) {
				return res.status(400).json({ error: "Too many arguments" })
			}

			if (fileId) {
				// TODO: abstract to getFileById
				const file = await prisma.file.findUnique({
					where: {
						id: fileId
					}
				})

				if (!file) {
					return res.status(404).json({ error: "File not found" })
				}

				return res.json(file.html)
			} else {
				if (!content || !title) {
					return res.status(400).json({ error: "Missing arguments" })
				}

				const renderedHTML = getHtmlFromFile({
					title,
					content
				})

				res.setHeader("Content-Type", "text/plain")
				res.status(200).write(renderedHTML)
				res.end()
				return
			}
		default:
			return res.status(405).json({ error: "Method not allowed" })
	}
}
