import Auth from "../components"
import { getRequiresPasscode } from "src/pages/api/auth/requires-passcode"
import { getMetadata } from "src/app/lib/metadata"
import { getAuthProviders, isCredentialEnabled } from "@lib/server/auth-props"

async function getPasscode() {
	return await getRequiresPasscode()
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
