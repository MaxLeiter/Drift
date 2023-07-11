import { getMetadata } from "src/app/lib/metadata"

import Auth from "../components"
import { getAuthProviders, isCredentialEnabled } from "@lib/server/auth-props"
import { PageWrapper } from "@components/page-wrapper"

export default function SignInPage() {
	return (
		<PageWrapper>
			<Auth
				page="signin"
				credentialAuth={isCredentialEnabled()}
				authProviders={getAuthProviders()}
			/>
		</PageWrapper>
	)
}

export const metadata = getMetadata({
	title: "Sign in"
})
