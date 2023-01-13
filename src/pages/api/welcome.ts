// a nextjs api handerl

import { withMethods } from "@lib/api-middleware/with-methods"
import config from "@lib/config"
import { getHtmlFromFile } from "@lib/server/get-html-from-drift-file"

import { NextApiRequest, NextApiResponse } from "next"

export async function getWelcomeContent() {
	const introContent = config.welcome_content
	const introTitle = config.welcome_title

	return {
		title: introTitle,
		content: introContent,
		rendered: await getHtmlFromFile({
			title: `intro.md`,
			content: introContent
		})
	}
}

async function handler(_: NextApiRequest, res: NextApiResponse) {
	const welcomeContent = await getWelcomeContent()
	if (!welcomeContent) {
		return res.status(500).json({ error: "Missing welcome content" })
	}

	return res.json(welcomeContent)
}

export default withMethods(["GET"], handler)
