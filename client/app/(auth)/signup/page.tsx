import Auth from "../components"
import Header from "@components/header"
import { getRequiresPasscode } from "pages/api/auth/requires-passcode"
import PageWrapper from "@components/page-wrapper"

const getPasscode = async () => {
	return await getRequiresPasscode()
}

export default async function SignUpPage() {
	const requiresPasscode = await getPasscode()
	return (
		<PageWrapper signedIn={false}>
			<Auth page="signup" requiresServerPassword={requiresPasscode} />
		</PageWrapper>
	)
}
