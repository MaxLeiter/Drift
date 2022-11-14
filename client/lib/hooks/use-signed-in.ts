import Cookies from "js-cookie"
import { useEffect } from "react"
import useSharedState from "./use-shared-state"


const useSignedIn = () => {
	const [signedIn, setSignedIn] = useSharedState(
		"signedIn",
		typeof window === "undefined" ? false : !!Cookies.get("drift-token")
	)
	const token = Cookies.get("drift-token")
	const signin = (token: string) => {
		setSignedIn(true)
		// TODO: investigate SameSite / CORS cookie security
		Cookies.set("drift-token", token)
	}

	useEffect(() => {
		const attemptSignIn = async () => {
			// If header auth is enabled, the reverse proxy will add it between this fetch and the server.
			// Otherwise, the token will be used. 
			const res = await fetch("/server-api/auth/verify-signed-in", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`
				}
			})

			if (res.status !== 200) {
				setSignedIn(false)
				return
			}
		}

		attemptSignIn()
	}, [setSignedIn, token])


	useEffect(() => {
		if (token) {
			setSignedIn(true)
		} else {
			setSignedIn(false)
		}
	}, [setSignedIn, token])

	return { signedIn, signin, token }
}

export default useSignedIn
