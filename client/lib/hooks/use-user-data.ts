import { User } from "@lib/types"
import Cookies from "js-cookie"
import { useRouter } from "next/router"
import { useEffect, useMemo, useState } from "react"

const useUserData = () => {
	const [authToken, setAuthToken] = useState<string>(
		Cookies.get("drift-token") || ""
	)
	const [user, setUser] = useState<User>()
	const router = useRouter()
	useEffect(() => {
		const token = Cookies.get("drift-token")
		if (token) {
			setAuthToken(token)
		}
	}, [setAuthToken])

	useEffect(() => {
		if (authToken) {
			const fetchUser = async () => {
				const response = await fetch(`/server-api/users/self`, {
					headers: {
						Authorization: `Bearer ${authToken}`
					}
				})
				if (response.ok) {
					const user = await response.json()
					setUser(user)
				} else {
					Cookies.remove("drift-token")
					setAuthToken("")
					router.push("/")
				}
			}
			fetchUser()
		}
	}, [authToken, router])

	return user
}

export default useUserData
