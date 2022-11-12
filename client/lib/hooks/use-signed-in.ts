import { TOKEN_COOKIE_NAME } from "@lib/constants"
import { getCookie, setCookie } from "cookies-next"
import { useEffect } from "react"
import useSharedState from "./use-shared-state"

const useSignedIn = () => {
	const token = getCookie(TOKEN_COOKIE_NAME)

	const [signedIn, setSignedIn] = useSharedState(
		"signedIn",
		typeof window === "undefined" ? false : !!token
	)

	const signin = (token: string) => {
		setSignedIn(true)
		// TODO: investigate SameSite / CORS cookie security
		setCookie(TOKEN_COOKIE_NAME, token)
	}

	// useEffect(() => {
	// 	if (token) {
	// 		setSignedIn(true)
	// 	} else {
	// 		setSignedIn(false)
	// 	}
	// }, [setSignedIn, token])

	console.log("signed 	in", signedIn)

	return { signedIn, signin, token }
}

export default useSignedIn
