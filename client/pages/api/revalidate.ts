import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.headers['x-secret-key'] !== process.env.SECRET_KEY) {
        return res.status(401).send('Unauthorized')
    }

    const { path } = req.query

    if (!path || typeof path !== 'string') {
        return res.status(400).json({
            error: "Missing path"
        })
    }

    try {
        await res.unstable_revalidate(path)
        return res.json({ revalidated: true })
    } catch (err) {
        // If there was an error, Next.js will continue
        // to show the last successfully generated page
        return res.status(500).send('Error revalidating')
    }
}
