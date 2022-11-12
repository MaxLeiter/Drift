// nextjs typescript api handler

import { withMethods } from "@lib/api-middleware/with-methods"

import { authOptions } from "@lib/server/auth"
import prisma, { getPostById } from "@lib/server/prisma"
import { NextApiRequest, NextApiResponse } from "next"
import { unstable_getServerSession } from "next-auth/next"
import { File } from "@lib/server/prisma"
import * as crypto from "crypto"
import { getHtmlFromFile } from "@lib/server/get-html-from-drift-file"
import { getSession } from "next-auth/react"
import { parseQueryParam } from "@lib/server/parse-query-param"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === "POST") {
		return await handlePost(req, res)
	} else {
		return await handleGet(req, res)
	}
}

export default withMethods(["POST", "GET"], handler)

async function handlePost(req: NextApiRequest, res: NextApiResponse<any>) {
	try {
		const session = await unstable_getServerSession(req, res, authOptions)

		const files = req.body.files as File[]
		const fileTitles = files.map((file) => file.title)
		const missingTitles = fileTitles.filter((title) => title === "")
		if (missingTitles.length > 0) {
			throw new Error("All files must have a title")
		}

		if (files.length === 0) {
			throw new Error("You must submit at least one file")
		}

		let hashedPassword: string = ""
		if (req.body.visibility === "protected") {
			hashedPassword = crypto
				.createHash("sha256")
				.update(req.body.password)
				.digest("hex")
		}

		const postFiles = files.map((file) => {
			const html = getHtmlFromFile(file)

			return {
				title: file.title,
				content: file.content,
				sha: crypto
					.createHash("sha256")
					.update(file.content)
					.digest("hex")
					.toString(),
				html: html,
				userId: session?.user.id
				// postId: post.id
			}
		}) as File[]

		const post = await prisma.post.create({
			data: {
				title: req.body.title,
				description: req.body.description,
				visibility: req.body.visibility,
				password: hashedPassword,
				expiresAt: req.body.expiresAt,
				// authorId: session?.user.id,
				author: {
					connect: {
						id: session?.user.id
					}
				},
				files: {
					create: postFiles
				}
			}
		})

		return res.json(post)
	} catch (error) {
		return res.status(500).json(error)
	}
}

async function handleGet(req: NextApiRequest, res: NextApiResponse<any>) {
	const id = parseQueryParam(req.query.id)
	const files = req.query.files ? parseQueryParam(req.query.files) : true
	
	if (!id) {
		return res.status(400).json({ error: "Missing id" })
	}

	const post = await getPostById(id, Boolean(files))

	if (!post) {
		return res.status(404).json({ message: "Post not found" })
	}

	if (post.visibility === "public") {
		res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate")
		return res.json(post)
	} else if (post.visibility === "unlisted") {
		res.setHeader("Cache-Control", "s-maxage=1, stale-while-revalidate")
	}

	const session = await getSession({ req })

	// the user can always go directly to their own post
	if (session?.user.id === post.authorId) {
		return res.json(post)
	}

	if (post.visibility === "protected") {
		return {
			isProtected: true,
			post: {
				id: post.id,
				visibility: post.visibility,
				title: post.title
			}
		}
	}

	return res.status(404).json({ message: "Post not found" })
}
