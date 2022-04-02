type Config = {
	port: number
	jwt_secret: string
	drift_home: string
	is_production: boolean
	memory_db: boolean
	enable_admin: boolean
	secret_key: string
	registration_password: string
}

const config = (): Config => {
	const stringToBoolean = (str: string | undefined): boolean => {
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

	const throwIfUndefined = (str: string | undefined, name: string): string => {
		if (str === undefined) {
			throw new Error(`Missing environment variable: ${name}`)
		}
		return str
	}

	const validNodeEnvs = (str: string | undefined) => {
		const valid = ["development", "production"]
		if (str && !valid.includes(str)) {
			throw new Error(`Invalid NODE_ENV set: ${str}`)
		} else if (!str) {
			console.warn("No NODE_ENV specified, defaulting to development")
		} else {
			console.log(`Using NODE_ENV: ${str}`)
		}
	}

	validNodeEnvs(process.env.NODE_ENV)

	const config: Config = {
		port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
		jwt_secret: process.env.JWT_SECRET || "myjwtsecret",
		drift_home: process.env.DRIFT_HOME || "~/.drift",
		is_production: process.env.NODE_ENV === "production",
		memory_db: stringToBoolean(process.env.MEMORY_DB),
		enable_admin: stringToBoolean(process.env.ENABLE_ADMIN),
		secret_key: throwIfUndefined(process.env.SECRET_KEY, "SECRET_KEY"),
		registration_password: process.env.REGISTRATION_PASSWORD || ""
	}
	return config
}

export default config()
