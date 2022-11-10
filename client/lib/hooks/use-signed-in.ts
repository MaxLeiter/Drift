import { getCookie, setCookie } from "cookies-next"
import { useEffect } from "react"
import useSharedState from "./use-shared-state"

const useSignedIn = () => {
	const token = getCookie("drift-token")

	const [signedIn, setSignedIn] = useSharedState(
		"signedIn",
		typeof window === "undefined" ? false : !!token
	)
	const signin = (token: string) => {
		setSignedIn(true)
		// TODO: investigate SameSite / CORS cookie security
		setCookie("drift-token", token)
	}

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
