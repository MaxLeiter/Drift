import { Router } from "express"
import { celebrate, Joi } from "celebrate"
import { File } from "@lib/models/File"
import { Post } from "@lib/models/Post"
import jwt, { UserJwtRequest } from "@lib/middleware/jwt"
import * as crypto from "crypto"
import { User } from "@lib/models/User"
import secretKey from "@lib/middleware/secret-key"
import markdown from "@lib/render-markdown"
import { Op } from "sequelize"

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
			files: Joi.any().required(),
			visibility: Joi.string()
				.custom(postVisibilitySchema, "valid visibility")
				.required(),
			userId: Joi.string().required(),
			password: Joi.string().optional()
		}
	}),
	async (req, res, next) => {
		try {
			let hashedPassword: string = ""
			if (req.body.visibility === "protected") {
				hashedPassword = crypto
					.createHash("sha256")
					.update(req.body.password)
					.digest("hex")
			}

			// check if all files have titles
			const files = req.body.files
			const fileTitles = files.map((file) => file.title)
			const missingTitles = fileTitles.filter((title) => title === "")
			if (missingTitles.length > 0) {
				throw new Error("All files must have a title")
			}

			const newPost = new Post({
				title: req.body.title,
				visibility: req.body.visibility,
				password: hashedPassword
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
						html
					})

					await newFile.$set("user", req.body.userId)
					await newFile.$set("post", newPost.id)
					await newFile.save()
					return newFile
				})
			)

			await Promise.all(
				newFiles.map((file) => {
					newPost.$add("files", file.id)
					newPost.save()
				})
			)

			res.json(newPost)
		} catch (e) {
			next(e)
		}
	}
)

posts.get("/", secretKey, async (req, res, next) => {
	try {
		const posts = await Post.findAll({
			attributes: ["id", "title", "visibility", "createdAt"]
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
						}
					],
					attributes: ["id", "title", "visibility", "createdAt"]
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
	async (req, res, next) => {
		const { q } = req.query
		if (typeof q !== "string") {
			return res.status(400).json({ error: "Invalid query" })
		}

		try {
			const posts = await Post.findAll({
				where: {
					[Op.or]: [
						{ title: { [Op.like]: `%${q}%` } },
						{ "$files.title$": { [Op.like]: `%${q}%` } },
						{ "$files.content$": { [Op.like]: `%${q}%` } }
					]
				},
				include: [
					{
						model: File,
						as: "files",
						attributes: ["id", "title"]
					}
				],
				attributes: ["id", "title", "visibility", "createdAt"],
				order: [["createdAt", "DESC"]]
			})

			res.json(posts)
		} catch (e) {
			next(e)
		}
	}
)

posts.get(
	"/:id",
	celebrate({
		params: {
			id: Joi.string().required()
		}
	}),
	async (req: UserJwtRequest, res, next) => {
		try {
			const post = await Post.findByPk(req.params.id, {
				include: [
					{
						model: File,
						as: "files",
						attributes: [
							"id",
							"title",
							"content",
							"sha",
							"createdAt",
							"updatedAt"
						]
					},
					{
						model: User,
						as: "users",
						attributes: ["id", "username"]
					}
				]
			})

			if (!post) {
				return res.status(404).json({ error: "Post not found" })
			}

			// if public or unlisted, cache
			if (post.visibility === "public" || post.visibility === "unlisted") {
				res.set("Cache-Control", "public, max-age=4800")
			}

			if (post.visibility === "public" || post?.visibility === "unlisted") {
				secretKey(req, res, () => {
					res.json(post)
				})
			} else if (post.visibility === "private") {
				jwt(req as UserJwtRequest, res, () => {
					res.json(post)
				})
			} else if (post.visibility === "protected") {
				const { password } = req.query
				if (!password || typeof password !== "string") {
					return jwt(req as UserJwtRequest, res, () => {
						res.json(post)
					})
				}
				const hash = crypto
					.createHash("sha256")
					.update(password)
					.digest("hex")
					.toString()
				if (hash !== post.password) {
					return res.status(400).json({ error: "Incorrect password." })
				}

				res.json(post)
			}
		} catch (e) {
			next(e)
		}
	}
)

posts.delete("/:id", jwt, async (req, res, next) => {
	try {
		const post = await Post.findByPk(req.params.id)
		if (!post) {
			return res.status(404).json({ error: "Post not found" })
		}

		jwt(req as UserJwtRequest, res, async () => {
			if (post.files?.length)
				await Promise.all(post.files.map((file) => file.destroy()))
			await post.destroy()
			res.json({ message: "Post deleted" })
		})
	} catch (e) {
		next(e)
	}
})

function getHtmlFromFile(file: any) {
	const renderAsMarkdown = [
		"markdown",
		"md",
		"mdown",
		"mkdn",
		"mkd",
		"mdwn",
		"mdtxt",
		"mdtext",
		"text",
		""
	]
	const fileType = () => {
		const pathParts = file.title.split(".")
		const language = pathParts.length > 1 ? pathParts[pathParts.length - 1] : ""
		return language
	}
	const type = fileType()
	let contentToRender: string = file.content || ""

	if (!renderAsMarkdown.includes(type)) {
		contentToRender = `~~~${type}
${file.content}
~~~`
	} else {
		contentToRender = "\n" + file.content
	}
	const html = markdown(contentToRender)
	return html
}
