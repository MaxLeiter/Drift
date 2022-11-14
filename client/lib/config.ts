type Config = {
	// port: number
	jwt_secret: string
	drift_home: string
	is_production: boolean
	memory_db: boolean
	enable_admin: boolean
	secret_key: string
	registration_password: string
	welcome_content: string
	welcome_title: string
	url: string
	GITHUB_CLIENT_ID: string
	GITHUB_CLIENT_SECRET: string
}

type EnvironmentValue = string | undefined
type Environment = { [key: string]: EnvironmentValue }

export const config = (env: Environment): Config => {
	const stringToBoolean = (str: EnvironmentValue): boolean => {
		if (str === "true") {
			return true
		} else if (str === "false") {
			return false
		} else if (str) {
			throw new Error(`Invalid boolean value: ${str}`)
		} else {
			return false
		}
	}

	// TODO: improve `key` type
	const throwIfUndefined = (key: keyof Environment): string => {
		const value = env[key]
		if (value === undefined) {
			throw new Error(`Missing environment variable: ${key}`)
		}

		return value
	}

	const defaultIfUndefined = (
		str: string,
		defaultValue: string
	): string => {
		const value = env[str]
		if (value === undefined) {
			return defaultValue
		}
		return value
	}

	const validNodeEnvs = (str: EnvironmentValue) => {
		const valid = ["development", "production", "test"]
		if (str && !valid.includes(str)) {
			throw new Error(`Invalid NODE_ENV set: ${str}`)
		} else if (!str) {
			console.warn("No NODE_ENV specified, defaulting to development")
		} else {
			console.log(`Using NODE_ENV: ${str}`)
		}
	}

	const is_production = env.NODE_ENV === "production"

	const developmentDefault = (
		name: string,
		defaultValue: string
	): string => {
		if (is_production) return throwIfUndefined(name)
		return defaultIfUndefined(name, defaultValue)
	}

	validNodeEnvs(env.NODE_ENV)

	const config: Config = {
		// port: env.PORT ? parseInt(env.PORT) : 3000,
		jwt_secret: env.JWT_SECRET || "myjwtsecret",
		drift_home: env.DRIFT_HOME || "~/.drift",
		is_production,
		memory_db: stringToBoolean(env.MEMORY_DB),
		enable_admin: stringToBoolean(env.ENABLE_ADMIN),
		secret_key: developmentDefault("SECRET_KEY", "secret"),
		registration_password: env.REGISTRATION_PASSWORD ?? "",
		welcome_content: env.WELCOME_CONTENT ?? "",
		welcome_title: env.WELCOME_TITLE ?? "",
		url: throwIfUndefined("DRIFT_URL"),
		GITHUB_CLIENT_ID: env.GITHUB_CLIENT_ID ?? "",
		GITHUB_CLIENT_SECRET: env.GITHUB_CLIENT_SECRET ?? "",
	}
	return config
}

export default config(process.env)
