import { Router } from "express"
import { celebrate, Joi } from "celebrate"
import { File } from "@lib/models/File"
import { Post } from "@lib/models/Post"
import jwt, { UserJwtRequest } from "@lib/middleware/jwt"
import * as crypto from "crypto"
import { User } from "@lib/models/User"
import secretKey from "@lib/middleware/secret-key"
import { Op } from "sequelize"
import { PostAuthor } from "@lib/models/PostAuthor"
import getHtmlFromFile from "@lib/get-html-from-drift-file"

export const posts = Router()

const postVisibilitySchema = (value: string) => {
	if (
		value === "public" ||
		value === "private" ||
		value === "unlisted" ||
		value === "protected"
	) {
		return value
	} else {
		throw new Error("Invalid post visibility")
	}
}

posts.post(
	"/create",
	jwt,
	celebrate({
		body: {
			title: Joi.string().required(),
			description: Joi.string().optional().min(0).max(256),
			files: Joi.any().required(),
			visibility: Joi.string()
				.custom(postVisibilitySchema, "valid visibility")
				.required(),
			userId: Joi.string().required(),
			password: Joi.string().optional(),
			//  expiresAt, allow to be null
			expiresAt: Joi.date().optional().allow(null, ""),
			parentId: Joi.string().optional().allow(null, "")
		}
	}),
	async (req, res) => {
		try {
			// check if all files have titles
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

			const newPost = new Post({
				title: req.body.title,
				description: req.body.description,
				visibility: req.body.visibility,
				password: hashedPassword,
				expiresAt: req.body.expiresAt
			})

			await newPost.save()
			await newPost.$add("users", req.body.userId)
			const newFiles = await Promise.all(
				files.map(async (file) => {
					const html = getHtmlFromFile(file)
					const newFile = new File({
						title: file.title || "",
						content: file.content,
						sha: crypto
							.createHash("sha256")
							.update(file.content)
							.digest("hex")
							.toString(),
						html: html || "",
						userId: req.body.userId,
						postId: newPost.id
					})
					await newFile.save()
					return newFile
				})
			)

			await Promise.all(
				newFiles.map(async (file) => {
					await newPost.$add("files", file.id)
					await newPost.save()
				})
			)
			if (req.body.parentId) {
				// const parentPost = await Post.findOne({
				// 	where: { id: req.body.parentId }
				// })
				// if (parentPost) {
				// 	await parentPost.$add("children", newPost.id)
				// 	await parentPost.save()
				// }
				const parentPost = await Post.findByPk(req.body.parentId)
				if (parentPost) {
					newPost.$set("parent", req.body.parentId)
					await newPost.save()
				} else {
					throw new Error("Parent post not found")
				}
			}

			res.json(newPost)
		} catch (e) {
			res.status(400).json(e)
		}
	}
)

posts.get("/", secretKey, async (req, res, next) => {
	try {
		const posts = await Post.findAll({
			attributes: ["id", "title", "description", "visibility", "createdAt"]
		})
		res.json(posts)
	} catch (e) {
		next(e)
	}
})

posts.get("/mine", jwt, async (req: UserJwtRequest, res, next) => {
	if (!req.user) {
		return res.status(401).json({ error: "Unauthorized" })
	}

	const page = parseInt(req.headers["x-page"]?.toString() || "1")

	try {
		const user = await User.findByPk(req.user.id, {
			include: [
				{
					model: Post,
					as: "posts",
					include: [
						{
							model: File,
							as: "files",
							attributes: ["id", "title", "createdAt"]
						},
						{
							model: Post,
							as: "parent",
							attributes: ["id", "title", "visibility"]
						}
					],
					attributes: [
						"id",
						"title",
						"description",
						"visibility",
						"createdAt",
						"expiresAt"
					]
				}
			]
		})
		if (!user) {
			return res.status(404).json({ error: "User not found" })
		}

		const userPosts = user.posts
		const sorted = userPosts?.sort((a, b) => {
			return b.createdAt.getTime() - a.createdAt.getTime()
		})

		const paginated = sorted?.slice((page - 1) * 10, page * 10)

		const hasMore =
			paginated && sorted ? paginated.length < sorted.length : false

		return res.json({
			posts: paginated,
			hasMore
		})
	} catch (error) {
		next(error)
	}
})

posts.get(
	"/search",
	jwt,
	celebrate({
		query: {
			q: Joi.string().required()
		}
	}),
	async (req: UserJwtRequest, res, next) => {
		const { q } = req.query
		if (typeof q !== "string") {
			return res.status(400).json({ error: "Invalid query" })
		}

		try {
			const posts = await Post.findAll({
				where: {
					[Op.or]: [
						{ title: { [Op.like]: `%${q}%` } },
						{ description: { [Op.like]: `%${q}%` } },
						{ "$files.title$": { [Op.like]: `%${q}%` } },
						{ "$files.content$": { [Op.like]: `%${q}%` } }
					],
					[Op.and]: [{ "$users.id$": req.user?.id || "" }]
				},
				include: [
					{
						model: File,
						as: "files",
						attributes: ["id", "title"]
					},
					{
						model: User,
						as: "users",
						attributes: ["id", "username"]
					},
					{
						model: Post,
						as: "parent",
						attributes: ["id", "title", "visibility"]
					}
				],
				attributes: [
					"id",
					"title",
					"description",
					"visibility",
					"createdAt",
					"deletedAt"
				],
				order: [["createdAt", "DESC"]]
			})

			res.json(posts)
		} catch (e) {
			next(e)
		}
	}
)

const fullPostSequelizeOptions = {
	include: [
		{
			model: File,
			as: "files",
			attributes: ["id", "title", "content", "sha", "createdAt", "updatedAt"]
		},
		{
			model: User,
			as: "users",
			attributes: ["id", "username"]
		},
		{
			model: Post,
			as: "parent",
			attributes: ["id", "title", "visibility", "createdAt"]
		}
	],
	attributes: [
		"id",
		"title",
		"description",
		"visibility",
		"createdAt",
		"updatedAt",
		"deletedAt",
		"expiresAt"
	]
}

posts.get(
	"/authenticate",
	celebrate({
		query: {
			id: Joi.string().required(),
			password: Joi.string().required()
		}
	}),
	async (req, res, next) => {
		const { id, password } = req.query

		const post = await Post.findByPk(id?.toString(), {
			...fullPostSequelizeOptions,
			attributes: [...fullPostSequelizeOptions.attributes, "password"]
		})

		const hash = crypto
			.createHash("sha256")
			.update(password?.toString() || "")
			.digest("hex")
			.toString()

		if (hash !== post?.password) {
			return res.status(400).json({ error: "Incorrect password." })
		}

		res.json(post)
	}
)

posts.get(
	"/:id",
	secretKey,
	celebrate({
		params: {
			id: Joi.string().required()
		}
	}),
	async (req: UserJwtRequest, res, next) => {
		const isUserAuthor = (post: Post) => {
			return (
				req.user?.id &&
				post.users?.map((user) => user.id).includes(req.user?.id)
			)
		}

		try {
			const post = await Post.findByPk(req.params.id, fullPostSequelizeOptions)

			if (!post) {
				return res.status(404).json({ error: "Post not found" })
			}

			// if public or unlisted, cache
			if (post.visibility === "public" || post.visibility === "unlisted") {
				res.set("Cache-Control", "public, max-age=4800")
			}

			if (post.visibility === "public" || post?.visibility === "unlisted") {
				res.json(post)
			} else if (post.visibility === "private") {
				jwt(req as UserJwtRequest, res, () => {
					if (isUserAuthor(post)) {
						res.json(post)
					} else {
						res.status(403).send()
					}
				})
			} else if (post.visibility === "protected") {
				// The client ensures to not send the post to the client.
				// See client/pages/post/[id].tsx::getServerSideProps
				res.json(post)
			}
		} catch (e) {
			res.status(400).json(e)
		}
	}
)

posts.delete("/:id", jwt, async (req: UserJwtRequest, res, next) => {
	try {
		const post = await Post.findByPk(req.params.id, {
			include: [
				{
					model: User,
					as: "users",
					attributes: ["id"]
				},
				{
					model: File,
					as: "files",
					attributes: ["id"]
				}
			]
		})
		if (!post) {
			return res.status(404).json({ error: "Post not found" })
		}

		if (req.user?.id !== post.users![0].id) {
			return res.status(403).json({ error: "Forbidden" })
		}
		if (post.files?.length)
			await Promise.all(post.files.map((file) => file.destroy()))

		const postAuthor = await PostAuthor.findOne({
			where: {
				postId: post.id
			}
		})
		if (postAuthor) await postAuthor.destroy()
		await post.destroy()
		res.json({ message: "Post deleted" })
	} catch (e) {
		next(e)
	}
})

posts.put(
	"/:id",
	jwt,
	celebrate({
		params: {
			id: Joi.string().required()
		},
		body: {
			visibility: Joi.string()
				.custom(postVisibilitySchema, "valid visibility")
				.required(),
			password: Joi.string().optional()
		}
	}),
	async (req: UserJwtRequest, res, next) => {
		try {
			const isUserAuthor = (post: Post) => {
				return (
					req.user?.id &&
					post.users?.map((user) => user.id).includes(req.user?.id)
				)
			}

			const { visibility, password } = req.body

			let hashedPassword: string = ""
			if (visibility === "protected") {
				hashedPassword = crypto
					.createHash("sha256")
					.update(password)
					.digest("hex")
			}

			const { id } = req.params
			const post = await Post.findByPk(id, {
				include: [
					{
						model: User,
						as: "users",
						attributes: ["id"]
					}
				]
			})

			if (!post) {
				return res.status(404).json({ error: "Post not found" })
			}

			if (!isUserAuthor(post)) {
				return res
					.status(403)
					.json({ error: "This post does not belong to you" })
			}

			await Post.update(
				{ password: hashedPassword, visibility },
				{ where: { id } }
			)

			res.json({ id, visibility })
		} catch (e) {
			res.status(400).json(e)
		}
	}
)
