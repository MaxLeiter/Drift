import Auth from "../components"
import { getRequiresPasscode } from "pages/api/auth/requires-passcode"
import config from "@lib/config"

const getPasscode = async () => {
	return await getRequiresPasscode()
}

function isGithubEnabled()  {
	return config.github_client_id.length && config.github_client_secret.length ? true : false
}

export default async function SignUpPage() {
	const requiresPasscode = await getPasscode()
	return <Auth page="signup" requiresServerPassword={requiresPasscode} isGithubEnabled={isGithubEnabled()} />
}
