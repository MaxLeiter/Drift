import config from "@lib/config"

export type AuthProviders = {
	enabled: boolean
	id: "keycloak" | "github"
	public_name: string
}[]

export function isGithubEnabled(): boolean {
	return !!(config.github_client_id && config.github_client_secret)
}

export function isKeycloakEnabled(): boolean {
	return !!(
		config.keycloak_client_id &&
		config.keycloak_client_secret &&
		config.keycloak_issuer
	)
}

export function isCredentialEnabled(): boolean {
	return config.credential_auth
}

export function getAuthProviders(): AuthProviders {
	return [
		{
			enabled: isGithubEnabled(),
			id: "github",
			public_name: "Github"
		},
		{
			enabled: isKeycloakEnabled(),
			id: "keycloak",
			public_name: config.keycloak_name || "Keycloak"
		}
	]
}
