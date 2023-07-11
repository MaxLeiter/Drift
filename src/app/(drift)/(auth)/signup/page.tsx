import Auth from "../components"
import { getMetadata } from "src/app/lib/metadata"
import { getAuthProviders, isCredentialEnabled } from "@lib/server/auth-props"
import { getRequiresPasscode } from "src/app/api/auth/requires-passcode/route"
import { PageWrapper } from "@components/page-wrapper"

async function getPasscode() {
	return getRequiresPasscode()
}

export default async function SignUpPage() {
	const requiresPasscode = await getPasscode()
	return (
		<PageWrapper>
			<Auth
				page="signup"
				requiresServerPassword={requiresPasscode}
				credentialAuth={isCredentialEnabled()}
				authProviders={getAuthProviders()}
			/>
		</PageWrapper>
	)
}

export const metadata = getMetadata({
	title: "Sign up"
})
