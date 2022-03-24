import { Sequelize } from "sequelize-typescript"

export const sequelize = new Sequelize({
	dialect: "sqlite",
	database: "drift",
	storage:
		process.env.MEMORY_DB === "true"
			? ":memory:"
			: __dirname + "/../../drift.sqlite",
	models: [__dirname + "/models"],
	host: "localhost"
})
