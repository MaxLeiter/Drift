/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	setupFiles: ["<rootDir>/src/test/setup-tests.ts"],
	// TODO: update to app dir
	moduleNameMapper: {
		"@lib/(.*)": "<rootDir>/src/lib/$1",
		"@components/(.*)": "<rootDir>/src/app/components/$1",
		"\\.(css)$": "identity-obj-proxy"
	},
	testPathIgnorePatterns: ["/node_modules/", "/.next/"],
	transform: {
		"^.+\\.(js|jsx|ts|tsx)$": "ts-jest"
	}
}
