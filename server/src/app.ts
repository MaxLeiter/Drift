import * as express from "express"
import * as bodyParser from "body-parser"
import * as errorhandler from "strong-error-handler"
import { posts, user, auth, files, admin, health } from "@routes/index"
import { errors } from "celebrate"
import secretKey from "@lib/middleware/secret-key"
import markdown from "@lib/render-markdown"
import config from "@lib/config"
import { ServerInfo } from "@lib/models/ServerInfo"

export const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ limit: "5mb" }))

app.use("/auth", auth)
app.use("/posts", posts)
app.use("/user", user)
app.use("/files", files)
app.use("/admin", admin)
app.use("/health", health)

app.get("/welcome", secretKey, async (req, res) => {
	const serverInfo = await ServerInfo.findOne({
		where: {
			id: "1"
		}
	})

	if (!serverInfo) {
		return res.status(500).json({
			message: "Server info not found."
		})
	}

	const { welcomeMessage, welcomeTitle } = serverInfo

	return res.json({
		title: welcomeTitle,
		content: welcomeMessage,
		rendered: markdown(welcomeMessage)
	})
})

app.use(errors())

app.use(
	errorhandler({
		debug: !config.is_production,
		log: true
	})
)
