import { cookies } from "next/headers"

export const isSignedIn = () => {
	const cookieList = cookies()
	return cookieList.has("drift-token") && cookieList.has("drift-userid")
}
