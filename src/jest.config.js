/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	setupFiles: ["<rootDir>/test/setup-tests.ts"],
	moduleNameMapper: {
		"@lib/(.*)": "<rootDir>/src/lib/$1",
		"@routes/(.*)": "<rootDir>/src/routes/$1"
	},
	testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/dist/"]
}
