/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
	preset: "ts-jest",
	testEnvironment: "jsdom",
	// setupFiles: ["<rootDir>/test/setup-tests.ts"],
	moduleNameMapper: {
		"@lib/(.*)": "<rootDir>/lib/$1",
		"@components/(.*)": "<rootDir>/routes/$1",
		"@pages/(.*)": "<rootDir>/routes/$1",
		"@public/(.*)": "<rootDir>/public/$1",
		"@styles/(.*)": "<rootDir>/styles/$1"
	},
	testPathIgnorePatterns: [
		"<rootDir>/node_modules/",
		"<rootDir>/dist/",
		"<rootDir>/.next/",
		"<rootDir>/public/"
	],
	testMatch: [
		"**/__tests__/**/*.+(ts|tsx|js)",
		"**/?(*.)+(spec|test).+(ts|tsx|js)"
	]
}
