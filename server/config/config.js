const path = require("path")
module.exports = {
	production: {
		database: path.join(__dirname, "..", "drift.sqlite"),
		dialect: "sqlite"
	},
	development: {
		database: path.join(__dirname, "..", "drift.sqlite"),
		dialect: "sqlite",
		debug: true,
		logging: true
	}
}
