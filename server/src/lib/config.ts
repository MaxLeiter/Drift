type Config = {
	port: number
	jwt_secret: string
	drift_home: string
	is_production: boolean
	memory_db: boolean
	enable_admin: boolean
	secret_key: string
	registration_password: string
	welcome_content: string | undefined
	welcome_title: string | undefined
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

	const throwIfUndefined = (str: EnvironmentValue, name: string): string => {
		if (str === undefined) {
			throw new Error(`Missing environment variable: ${name}`)
		}
		return str
	}

	const defaultIfUndefined = (
		str: EnvironmentValue,
		defaultValue: string
	): string => {
		if (str === undefined) {
			return defaultValue
		}
		return str
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
		str: EnvironmentValue,
		name: string,
		defaultValue: string
	): string => {
		if (is_production) return throwIfUndefined(str, name)
		return defaultIfUndefined(str, defaultValue)
	}

	validNodeEnvs(env.NODE_ENV)

	const config: Config = {
		port: env.PORT ? parseInt(env.PORT) : 3000,
		jwt_secret: env.JWT_SECRET || "myjwtsecret",
		drift_home: env.DRIFT_HOME || "~/.drift",
		is_production,
		memory_db: stringToBoolean(env.MEMORY_DB),
		enable_admin: stringToBoolean(env.ENABLE_ADMIN),
		secret_key: developmentDefault(env.SECRET_KEY, "SECRET_KEY", "secret"),
		registration_password: env.REGISTRATION_PASSWORD ?? "",
		welcome_content: env.WELCOME_CONTENT,
		welcome_title: env.WELCOME_TITLE
	}
	return config
}

export default config(process.env)
