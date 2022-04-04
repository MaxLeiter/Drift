import { config } from "../config"

describe("Config", () => {
    it("should build a valid development config when no environment is set", () => {
        const emptyEnv = {};
        const result = config(emptyEnv);

        expect(result).toHaveProperty("is_production", false)
        expect(result).toHaveProperty("port")
        expect(result).toHaveProperty("jwt_secret")
        expect(result).toHaveProperty("drift_home")
        expect(result).toHaveProperty("memory_db")
        expect(result).toHaveProperty("enable_admin")
        expect(result).toHaveProperty("secret_key")
        expect(result).toHaveProperty("registration_password")
        expect(result).toHaveProperty("welcome_content")
        expect(result).toHaveProperty("welcome_title")
    })

    it("should fail when building a prod environment without SECRET_KEY", () => {
        expect(() => config({ NODE_ENV: "production" }))
            .toThrow(new Error("Missing environment variable: SECRET_KEY"))
    })

    it("should build a prod config with a SECRET_KEY", () => {
        const result = config({ NODE_ENV: "production", SECRET_KEY: "secret" })

        expect(result).toHaveProperty("is_production", true)
        expect(result).toHaveProperty("secret_key", "secret")
    })

    describe("jwt_secret", () => {
        it("should use default jwt_secret when environment is blank string", () => {
            const result = config({ JWT_SECRET: "" })

            expect(result).toHaveProperty("is_production", false)
            expect(result).toHaveProperty("jwt_secret", "myjwtsecret")
        })
    })

    describe("booleans", () => {
        it("should parse 'true' as true", () => {
            const result = config({ MEMORY_DB: "true" })

            expect(result).toHaveProperty("memory_db", true)
        })
        it("should parse 'false' as false", () => {
            const result = config({ MEMORY_DB: "false" })

            expect(result).toHaveProperty("memory_db", false)
        })
        it("should fail when it is not parseable", () => {
            expect(() => config({ MEMORY_DB: "foo" }))
                .toThrow(new Error("Invalid boolean value: foo"))
        })
        it("should default to false when the string is empty", () => {
            const result = config({ MEMORY_DB: "" })

            expect(result).toHaveProperty("memory_db", false)
        })
    })
})
