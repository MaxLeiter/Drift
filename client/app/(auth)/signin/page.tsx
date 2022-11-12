import Auth from "../components"
import Header from "app/components/header"

export default function SignInPage() {
	return (
		<>
			<Header />
			<Auth page="signin" />
		</>
	)
}
