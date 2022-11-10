// a nextjs api handerl

import config from "@lib/config"
import markdown from "@lib/render-markdown"
import { NextApiRequest, NextApiResponse } from "next"

export const getWelcomeContent = async () => {
	const introContent = config.welcome_content
	const introTitle = config.welcome_title
	// if (!introContent || !introTitle) {
	// 	return {}
	// }

	console.log(introContent)

	return {
		title: introTitle,
		content: introContent,
		rendered: markdown(introContent)
	}
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const welcomeContent = await getWelcomeContent()
	if (!welcomeContent) {
		return res.status(500).json({ error: "Missing welcome content" })
	}

	return res.json(welcomeContent)
}
