import * as express from "express"
import * as bodyParser from "body-parser"
import * as errorhandler from "strong-error-handler"
import { posts, users, auth, files } from "@routes/index"
import { errors } from "celebrate"
import secretKey from "@lib/middleware/secret-key"
import markdown from "@lib/render-markdown"

export const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ limit: "5mb" }))

app.use("/auth", auth)
app.use("/posts", posts)
app.use("/users", users)
app.use("/files", files)

app.get("/welcome", secretKey, (req, res) => {
	const introContent = process.env.WELCOME_CONTENT
	const introTitle = process.env.WELCOME_TITLE

	if (!introContent || !introTitle) {
		return res.status(500).json({ error: "Missing welcome content" })
	}

	return res.json({
		title: introTitle,
		content: introContent,
		rendered: markdown(introContent)
	})
})

app.use(errors())

app.use(
	errorhandler({
		debug: process.env.ENV !== "production",
		log: true
	})
)
