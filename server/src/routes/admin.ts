import isAdmin, { UserJwtRequest } from "@lib/middleware/is-admin"
import { Post } from "@lib/models/Post"
import { User } from "@lib/models/User"
import { File } from "@lib/models/File"
import { Router } from "express"
import { celebrate, Joi } from "celebrate"

export const admin = Router()

admin.use(isAdmin)

admin.get("/is-admin", async (req, res) => {
	return res.json({
		isAdmin: true
	})
})

admin.get("/users", async (req, res, next) => {
	try {
		const users = await User.findAll({
			attributes: {
				exclude: ["password"],
				include: ["id", "username", "createdAt", "updatedAt"]
			},
			include: [
				{
					model: Post,
					as: "posts",
					attributes: ["id"]
				}
			]
		})
		res.json(users)
	} catch (e) {
		next(e)
	}
})

admin.post(
	"/users/toggle-role",
	celebrate({
		body: {
			id: Joi.string().required(),
			role: Joi.string().required().allow("user", "admin")
		}
	}),
	async (req: UserJwtRequest, res, next) => {
		try {
			const { id, role } = req.body
			if (req.user?.id === id) {
				return res.status(400).json({
					error: "You can't change your own role"
				})
			}

			const user = await User.findByPk(id)
			if (!user) {
				return res.status(404).json({
					error: "User not found"
				})
			}

			await user.update({
				role
			})

			await user.save()

			res.json({
				success: true
			})
		} catch (e) {
			next(e)
		}
	}
)

admin.delete("/users/:id", async (req, res, next) => {
	try {
		const user = await User.findByPk(req.params.id)
		if (!user) {
			return res.status(404).json({
				error: "User not found"
			})
		}
		// TODO: verify CASCADE is removing files + posts
		await user.destroy()

		res.json({
			success: true
		})
	} catch (e) {
		next(e)
	}
})

// admin.delete("/posts/:id", async (req, res, next) => {
// 	try {
// 		const post = await Post.findByPk(req.params.id)
// 		if (!post) {
// 			return res.status(404).json({
// 				error: "Post not found"
// 			})
// 		}
// 		await post.destroy()

// 		res.json({
// 			success: true
// 		})
// 	} catch (e) {
// 		next(e)
// 	}
// })

admin.get("/posts", async (req, res, next) => {
	try {
		const posts = await Post.findAll({
			attributes: {
				exclude: ["content"],
				include: ["id", "title", "visibility", "createdAt"]
			},
			include: [
				{
					model: File,
					as: "files",
					attributes: ["id", "title", "createdAt", "html"]
				},
				{
					model: User,
					as: "users",
					attributes: ["id", "username"]
				}
			]
		})
		res.json(posts)
	} catch (e) {
		next(e)
	}
})

admin.get("/post/:id", async (req, res, next) => {
	try {
		const post = await Post.findByPk(req.params.id, {
			attributes: {
				exclude: ["content"],
				include: ["id", "title", "visibility", "createdAt"]
			},
			include: [
				{
					model: File,
					as: "files",
					attributes: ["id", "title", "sha", "createdAt", "updatedAt", "html"]
				},
				{
					model: User,
					as: "users",
					attributes: ["id", "username"]
				}
			]
		})
		if (!post) {
			return res.status(404).json({
				message: "Post not found"
			})
		}

		res.json(post)
	} catch (e) {
		next(e)
	}
})

admin.delete("/post/:id", async (req, res, next) => {
	try {
		const post = await Post.findByPk(req.params.id, {
			include: [
				{
					model: File,
					as: "files"
				}
			]
		})

		if (!post) {
			return res.status(404).json({
				message: "Post not found"
			})
		}

		if (post.files?.length)
			await Promise.all(post.files.map((file) => file.destroy()))
		await post.destroy({ force: true })
		res.json({
			message: "Post deleted"
		})
	} catch (e) {
		next(e)
	}
})
