import Auth from "../components"
import { getRequiresPasscode } from "pages/api/auth/requires-passcode"

const getPasscode = async () => {
	return await getRequiresPasscode()
}

export default async function SignUpPage() {
	const requiresPasscode = await getPasscode()
	return (<Auth page="signup" requiresServerPassword={requiresPasscode} />)
}
