import { NextApiRequest, NextApiResponse } from "next"

const getRawFile = async (req: NextApiRequest, res: NextApiResponse) => {
	const { id, download } = req.query
	const file = await fetch(`${process.env.API_URL}/files/raw/${id}`, {
		headers: {
			Accept: "text/plain",
			"x-secret-key": process.env.SECRET_KEY || "",
			Authorization: `Bearer ${req.cookies["drift-token"]}`
		}
	})
	const json = await file.json()
	res.setHeader("Content-Type", "text/plain; charset=utf-8")
	res.setHeader("Cache-Control", "s-maxage=86400")
	if (file.ok) {
		const data = json
		const { title, content } = data
		// serve the file raw as plain text

		if (download) {
			res.setHeader("Content-Disposition", `attachment; filename="${title}"`)
		} else {
			res.setHeader("Content-Disposition", `inline; filename="${title}"`)
		}

		res.status(200).write(content, "utf-8")
		res.end()
	} else {
		res.status(404).send("File not found")
	}
}

export default getRawFile
