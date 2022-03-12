import { NextApiRequest, NextApiResponse } from "next"

const getRawFile = async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query
    const file = await fetch(`${process.env.API_URL}/api/file/${id}`)
    // serve the file raw as plain text
    res.setHeader("Content-Type", "text/plain")

}

export default getRawFile
