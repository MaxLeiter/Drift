import { celebrate, Joi } from "celebrate"
import { Router } from "express"
import { File } from "@lib/models/File"
import secretKey from "@lib/middleware/secret-key"
import jwt from "@lib/middleware/jwt"
import getHtmlFromFile from "@lib/get-html-from-drift-file"

export const files = Router()

files.post(
	"/html",
	jwt,
	// celebrate({
	// 	body: Joi.object().keys({
	// 		content: Joi.string().required().allow(""),
	// 		title: Joi.string().required().allow(""),
	// 	})
	// }),
	async (req, res, next) => {
		const { content, title } = req.body
		const renderedHtml = getHtmlFromFile({
			content,
			title
		})

		res.setHeader("Content-Type", "text/plain")
		// res.setHeader("Cache-Control", "public, max-age=4800")
		res.status(200).write(renderedHtml)
		res.end()
	}
)

files.get(
	"/raw/:id",
	celebrate({
		params: {
			id: Joi.string().required()
		}
	}),
	secretKey,
	async (req, res, next) => {
		try {
			const file = await File.findOne({
				where: {
					id: req.params.id
				},
				attributes: ["title", "content"]
			})

			if (!file) {
				return res.status(404).json({ error: "File not found" })
			}

			// TODO: JWT-checkraw files
			if (file?.post?.visibility === "private") {
				// jwt(req as UserJwtRequest, res, () => {
				//     res.json(file);
				// })
				res.json(file)
			} else {
				res.json(file)
			}
		} catch (e) {
			next(e)
		}
	}
)

files.get(
	"/html/:id",
	celebrate({
		params: {
			id: Joi.string().required()
		}
	}),
	async (req, res, next) => {
		try {
			const file = await File.findOne({
				where: {
					id: req.params.id
				},
				attributes: ["html"]
			})

			if (!file) {
				return res.status(404).json({ error: "File not found" })
			}

			res.setHeader("Content-Type", "text/plain")
			res.setHeader("Cache-Control", "public, max-age=4800")
			res.status(200).write(file.html)
			res.end()
		} catch (error) {
			next(error)
		}
	}
)
