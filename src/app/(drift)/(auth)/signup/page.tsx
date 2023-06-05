import Auth from "../components"
import { getMetadata } from "src/app/lib/metadata"
import { getAuthProviders, isCredentialEnabled } from "@lib/server/auth-props"
import { getRequiresPasscode } from "src/app/api/auth/requires-passcode/route"

async function getPasscode() {
	return getRequiresPasscode()
}

export default async function SignUpPage() {
	const requiresPasscode = await getPasscode()
	return (
		<Auth
			page="signup"
			requiresServerPassword={requiresPasscode}
			credentialAuth={isCredentialEnabled()}
			authProviders={getAuthProviders()}
		/>
	)
}

export const metadata = getMetadata({
	title: "Sign up"
})
