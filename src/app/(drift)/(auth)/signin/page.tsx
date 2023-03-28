import { getMetadata } from "src/app/lib/metadata"

import Auth from "../components"
import { getAuthProviders, isCredentialEnabled } from "@lib/server/auth-props"

export default function SignInPage() {
	return (
		<Auth
			page="signin"
			credentialAuth={isCredentialEnabled()}
			authProviders={getAuthProviders()}
		/>
	)
}

export const metadata = getMetadata({
	title: "Sign in"
})
