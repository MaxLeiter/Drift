const path = require("path")
console.log(path.join(__dirname, "..", "drift.sqlite"))
module.exports = {
	production: {
		database: path.join(__dirname, "..", "drift.sqlite"),
		host: "127.0.0.1",
		port: "3306",
		user: "root",
		password: "root",
		dialect: "sqlite"
	},
	development: {
		database: path.join(__dirname, "..", "drift.sqlite"),
		dialect: "sqlite",
		debug: true,
		logging: true
	}
}
