import { createServer } from "http"
import { app } from "./app"
import config from "./lib/config"
import "./database"
import { initServerInfo } from "./database"

;(async () => {
	initServerInfo()
	createServer(app).listen(config.port, () =>
		console.info(`Server running on port ${config.port}`)
	)
})()
