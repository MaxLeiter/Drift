import Auth from "../components"
import Header from "@components/header"
import { getRequiresPasscode } from "pages/api/auth/requires-passcode"

const getPasscode = async () => {
	return await getRequiresPasscode()
}

export default async function SignUpPage() {
	const requiresPasscode = await getPasscode()
	return (
		<>
			<Header />
			<Auth page="signup" requiresServerPassword={requiresPasscode} />
		</>
	)
}
