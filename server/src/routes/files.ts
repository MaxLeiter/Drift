import { celebrate, Joi } from "celebrate"
import { Router } from "express"
import { File } from "@lib/models/File"
import secretKey from "@lib/middleware/secret-key"

export const files = Router()

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
