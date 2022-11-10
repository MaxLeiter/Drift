import { TOKEN_COOKIE_NAME, USER_COOKIE_NAME } from "@lib/constants"
import { cookies } from "next/headers"

export const isSignedIn = () => {
	const cookieList = cookies()
	return cookieList.has(TOKEN_COOKIE_NAME) && cookieList.has(USER_COOKIE_NAME)
}
