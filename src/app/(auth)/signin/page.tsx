import config from "@lib/config"
import Auth from "../components"

function isGithubEnabled()  {
	return config.github_client_id.length && config.github_client_secret.length ? true : false
}

export default function SignInPage() {
	return <Auth page="signin" isGithubEnabled={isGithubEnabled()} />
}
