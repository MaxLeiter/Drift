import Auth from "@components/auth"
import Header from "@components/header"

export default function SignInPage() {
	return (
		<>
			<Header />
			<Auth page="signin" />
		</>
	)
}
