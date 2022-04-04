import Cookies from "js-cookie"
import { useRouter } from "next/router"
import { useEffect } from "react"
import useSharedState from "./use-shared-state"

const useSignedIn = () => {
	const [signedIn, setSignedIn] = useSharedState(
		"signedIn",
		typeof window === "undefined" ? false : !!Cookies.get("drift-token")
	)
	const token = Cookies.get("drift-token")
	const router = useRouter()
	const signin = (token: string) => {
		setSignedIn(true)
		// TODO: investigate SameSite / CORS cookie security
		Cookies.set("drift-token", token)
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
