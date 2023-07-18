import { getSession } from "next-auth/react"

/**
 * a fetch wrapper that adds `userId={userId}` to the query string
 */
export async function fetchWithUser(url: string, options: RequestInit = {}) {
	// TODO: figure out if this extra network call hurts performance
	const session = await getSession()
	const newUrl = new URL(url, process.env.NEXT_PUBLIC_DRIFT_URL)
	newUrl.searchParams.append("userId", session?.user.id || "")
	return fetch(newUrl.toString(), options)
}
