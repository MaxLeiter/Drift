import databasePath from "@lib/get-database-path"
import { Sequelize } from "sequelize-typescript"
import { SequelizeStorage, Umzug } from "umzug"

export const sequelize = new Sequelize({
	dialect: "sqlite",
	database: "drift",
	storage: process.env.MEMORY_DB === "true" ? ":memory:" : databasePath,
	models: [__dirname + "/lib/models"],
	logging: true
})

if (process.env.MEMORY_DB !== "true") {
	console.log(`Database path: ${databasePath}`)
} else {
	console.log("Using in-memory database")
}

const umzug = new Umzug({
	migrations: {
		glob:
			process.env.NODE_ENV === "production"
				? __dirname + "/migrations/*.js"
				: __dirname + "/migrations/*.ts"
	},
	context: sequelize.getQueryInterface(),
	storage: new SequelizeStorage({ sequelize }),
	logger: console
})

export type Migration = typeof umzug._types.migration
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
