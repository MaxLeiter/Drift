import { NextApiRequest, NextApiResponse } from "next"

const getRawFile = async (req: NextApiRequest, res: NextApiResponse) => {
	const { id } = req.query
	const file = await fetch(`${process.env.API_URL}/files/html/${id}`, {
		headers: {
			"x-secret-key": process.env.SECRET_KEY || "",
			Authorization: `Bearer ${req.cookies["drift-token"]}`
		}
	})
	if (file.ok) {
		const json = await file.text()
		const data = json
		// serve the file raw as plain text
		res.setHeader("Content-Type", "text/plain; charset=utf-8")
		res.setHeader("Cache-Control", "s-maxage=86400")
		res.status(200).write(data, "utf-8")
		res.end()
	} else {
		res.status(404).send("File not found")
	}
}

export default getRawFile
