// nextjs typescript api handler

import { withMethods } from "@lib/api-middleware/with-methods"

import { authOptions } from "@lib/server/auth"
import {prisma,  getPostById } from "@lib/server/prisma"
import { NextApiRequest, NextApiResponse } from "next"
import { unstable_getServerSession } from "next-auth/next"
import { File } from "@lib/server/prisma"
import * as crypto from "crypto"
import { getHtmlFromFile } from "@lib/server/get-html-from-drift-file"
import { getSession } from "next-auth/react"
import { parseQueryParam } from "@lib/server/parse-query-param"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	return await handlePost(req, res)
}

export default withMethods(["POST"], handler)

async function handlePost(req: NextApiRequest, res: NextApiResponse<any>) {
	try {
		const session = await unstable_getServerSession(req, res, authOptions)
		if (!session) {
			console.log("no session")
			return res.status(401).json({ error: "Unauthorized" })
		}

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

		const post = await prisma.post.create({
			data: {
				title: req.body.title,
				description: req.body.description,
				visibility: req.body.visibility,
				password: hashedPassword,
				expiresAt: req.body.expiresAt,
				parentId: req.body.parentId,
				// authorId: session?.user.id,
				author: {
					connect: {
						id: session?.user.id
					}
				}
				// files: {
				// 	connectOrCreate: postFiles.map((file) => ({
				// 		where: {
				// 			sha: file.sha
				// 		},
				// 		create: file
				// 	}))
				// }
			}
		})

		await Promise.all(
			files.map(async (file) => {
				const html = (await getHtmlFromFile(file)) as string

				return prisma.file.create({
					data: {
						title: file.title,
						content: file.content,
						sha: crypto
							.createHash("sha256")
							.update(file.content)
							.digest("hex")
							.toString(),
						html: html,
						userId: session.user.id,
						post: {
							connect: {
								id: post.id
							}
						}
					}
				})
			})
		)

		return res.json(post)
	} catch (error) {
		return res.status(500).json(error)
	}
}
