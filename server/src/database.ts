import config from "@lib/config"
import databasePath from "@lib/get-database-path"
import { Sequelize } from "sequelize-typescript"
import { SequelizeStorage, Umzug } from "umzug"
import { QueryTypes } from "sequelize"

export const sequelize = new Sequelize({
	dialect: "sqlite",
	database: "drift",
	storage: config.memory_db ? ":memory:" : databasePath,
	models: [__dirname + "/lib/models"],
	logging: console.log
})

export const initServerInfo = async () => {
	const serverInfo = await sequelize.query(
		"SELECT * FROM `server-info` WHERE id = '1'",
		{
			type: QueryTypes.SELECT
		}
	)

	if (serverInfo.length === 0) {
		console.log("server-info table not found, creating...")
		console.log(
			"You can change the welcome message and title on the admin settings page."
		)
		await sequelize.query("INSERT INTO `server-info` (id) VALUES ('1')", {
			type: QueryTypes.INSERT
		})
		console.log("server-info table created.")
	}
}

export const umzug = new Umzug({
	migrations: {
		glob: config.is_production
			? __dirname + "/migrations/*.js"
			: __dirname + "/migrations/*.ts"
	},
	context: sequelize.getQueryInterface(),
	storage: new SequelizeStorage({ sequelize }),
	logger: console
})

export type Migration = typeof umzug._types.migration

if (config.memory_db) {
	console.log("Using in-memory database")
} else {
	console.log(`Database path: ${databasePath}`)
}

// If you're in a development environment, you can manually migrate with `yarn migrate:{up,down}` in the `server` folder
if (config.is_production) {
	;(async () => {
		// Checks migrations and run them if they are not already applied. To keep
		// track of the executed migrations, a table (and sequelize model) called SequelizeMeta
		// will be automatically created (if it doesn't exist already) and parsed.
		console.log("Checking migrations...")
		const migrations = await umzug.up()
		if (migrations.length > 0) {
			console.log("Migrations applied:")
			console.log(migrations)
		} else {
			console.log("No migrations applied.")
		}
	})()
}
