import { withMethods } from "@lib/api-middleware/with-methods"
import { parseQueryParam } from "@lib/server/parse-query-param"
import { getPostById, PostWithFiles } from "@lib/server/prisma"
import type { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"
import { prisma } from "lib/server/prisma"
import * as crypto from "crypto"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === "GET") return handleGet(req, res)
	else if (req.method === "PUT") return handlePut(req, res)
	else if (req.method === "DELETE") return handleDelete(req, res)
}

export default withMethods(["GET", "PUT", "DELETE"], handler)

async function handleGet(req: NextApiRequest, res: NextApiResponse<any>) {
	const id = parseQueryParam(req.query.id)

	if (!id) {
		return res.status(400).json({ error: "Missing id" })
	}

	const post = await getPostById(id, {
		include: {
			files: true,
			author: true
		}
	})

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
		return res.json({
			...post,
		})
	}

	if (post.visibility === "protected") {
		const password = parseQueryParam(req.query.password)
		const hash = crypto
			.createHash("sha256")
			.update(password?.toString() || "")
			.digest("hex")
			.toString()

		if (hash === post.password) {
			return res.json({
				...post,
			})
		} else {
			return {
				isProtected: true,
				post: {
					id: post.id,
					visibility: post.visibility,
					title: post.title
				}
			}
		}
	}

	return res.status(404).json({ message: "Post not found" })
}

// PUT is for adjusting visibility and password
async function handlePut(req: NextApiRequest, res: NextApiResponse<any>) {
	const { password, visibility } = req.body
	const id = parseQueryParam(req.query.id)

	if (!id) {
		return res.status(400).json({ error: "Missing id" })
	}

	const post = await getPostById(id)

	if (!post) {
		return res.status(404).json({ message: "Post not found" })
	}

	const session = await getSession({ req })

	const isAuthor = session?.user.id === post.authorId

	if (!isAuthor) {
		return res.status(403).json({ message: "Unauthorized" })
	}

	if (visibility === "protected" && !password) {
		return res.status(400).json({ message: "Missing password" })
	}

	const hashedPassword = crypto
		.createHash("sha256")
		.update(password?.toString() || "")
		.digest("hex")
		.toString()

	const updatedPost = await prisma.post.update({
		where: {
			id
		},
		data: {
			visibility,
			password: visibility === "protected" ? hashedPassword : null
		}
	})

	res.json({
		id: updatedPost.id,
		visibility: updatedPost.visibility
	})
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse<any>) {
	const id = parseQueryParam(req.query.id)

	if (!id) {
		return res.status(400).json({ error: "Missing id" })
	}

	const post = await getPostById(id)

	if (!post) {
		return res.status(404).json({ message: "Post not found" })
	}

	const session = await getSession({ req })

	const isAuthor = session?.user.id === post.authorId
	const isAdmin = session?.user.role === "admin"

	if (!isAuthor && !isAdmin) {
		return res.status(403).json({ message: "Unauthorized" })
	}

	await prisma.post.delete({
		where: {
			id
		},
		include: {
			files: true
		}
	})

	res.json({ message: "Post deleted" })
}
