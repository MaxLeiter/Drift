// a nextjs api handerl

import config from "@lib/config"
import renderMarkdown from "@lib/render-markdown"
import { NextApiRequest, NextApiResponse } from "next"

export const getWelcomeContent = async () => {
	const introContent = config.welcome_content
	const introTitle = config.welcome_title
	

	console.log(renderMarkdown(introContent))
	return {
		title: introTitle,
		content: introContent,
		rendered: renderMarkdown(introContent)
	}
}

export default async function handler(
	_: NextApiRequest,
	res: NextApiResponse
) {
	const welcomeContent = await getWelcomeContent()
	if (!welcomeContent) {
		return res.status(500).json({ error: "Missing welcome content" })
	}
	console.log(welcomeContent.title)

	return res.json(welcomeContent)
}
