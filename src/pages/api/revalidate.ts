// https://beta.nextjs.org/docs/data-fetching/revalidating#on-demand-revalidation

import { withMethods } from "@lib/api-middleware/with-methods"
import config from "@lib/config"
import { parseQueryParam } from "@lib/server/parse-query-param"
import type { NextApiRequest, NextApiResponse } from "next"

async function handler(req: NextApiRequest, res: NextApiResponse) {
	// TODO: create a new secret?
	if (req.query.secret !== config.nextauth_secret) {
		return res.status(401).json({ message: "Invalid token" })
	}

	const path = parseQueryParam(req.query.path)

	try {
		if (path) {
			await res.revalidate(path)
			return res.json({ revalidated: true })
		}
	} catch (err) {
		// If there was an error, Next.js will continue
		// to show the last successfully generated page
		return res.status(500).send("Error revalidating")
	}
}

export default withMethods(["GET"], handler)
