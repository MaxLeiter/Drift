import { TOKEN_COOKIE_NAME } from "@lib/constants"
import { User } from "@lib/types"
import { deleteCookie, getCookie } from "cookies-next"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const useUserData = () => {
	const cookie = getCookie(TOKEN_COOKIE_NAME)
	const [authToken, setAuthToken] = useState<string>(
		cookie ? String(cookie) : ""
	)
	const [user, setUser] = useState<User>()
	const router = useRouter()
	useEffect(() => {
		const token = getCookie(TOKEN_COOKIE_NAME)
		if (token) {
			setAuthToken(String(token))
		}
	}, [setAuthToken])

	useEffect(() => {
		if (authToken) {
			const fetchUser = async () => {
				const response = await fetch(`/api/user/self`, {
					headers: {
						Authorization: `Bearer ${authToken}`
					}
				})
				if (response.ok) {
					const user = await response.json()
					setUser(user)
				} else {
					// deleteCookie("drift-token")
					// setAuthToken("")
					// router.push("/")
					console.log("not ok")
				}
			}
			fetchUser()
		}
	}, [authToken, router])

	return user
}

export default useUserData
