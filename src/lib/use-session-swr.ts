import { Session } from "next-auth"
import useSWR from "swr"

export function useSessionSWR() {
	const {
		data: session,
		error,
		isLoading,
		isValidating,
		mutate
	} = useSWR<Session>("/api/auth/session")

	return {
		session,
		error,
		isLoading,
		isValidating,
		mutate,
		/** undefined while loading */
		isAuthenticated: session?.user?.id ? true : isLoading ? undefined : false,
		/** undefined while loading */
		isAdmin:
			session?.user?.id === "admin" ? true : isLoading ? undefined : false
	}
}
