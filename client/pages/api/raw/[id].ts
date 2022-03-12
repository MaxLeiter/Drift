import { NextApiRequest, NextApiResponse } from "next"

const getRawFile = async (req: NextApiRequest, res: NextApiResponse) => {
    const { id, download } = req.query
    const file = await fetch(`${process.env.API_URL}/files/raw/${id}`)
    if (file.ok) {
        const data = await file.json()
        const { title, content } = data
        // serve the file raw as plain text
        res.setHeader("Content-Type", "text/plain")
        res.setHeader('Cache-Control', 's-maxage=86400');
        if (download) {
            res.setHeader("Content-Disposition", `attachment; filename="${title}"`)
        } else {
            res.setHeader("Content-Disposition", `inline; filename="${title}"`)
        }

        res.status(200).send(content)
    } else {
        res.status(404).send("File not found")
    }
}

export default getRawFile
