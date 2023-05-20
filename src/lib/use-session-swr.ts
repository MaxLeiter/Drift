import { Session } from "next-auth"
import useSWR, { SWRConfiguration } from "swr"

export function useSessionSWR(swrOpts: SWRConfiguration = {}) {
	const {
		data: session,
		error,
		isLoading,
		isValidating,
		mutate
	} = useSWR<Session>("/api/auth/session", {
		fetcher: (url) => fetch(url).then((res) => res.json()) as Promise<Session>,
		revalidateOnFocus: true,
		...swrOpts
	})

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
			session?.user?.role === "admin" ? true : isLoading ? undefined : false,
		userId: session?.user?.id
	}
}
