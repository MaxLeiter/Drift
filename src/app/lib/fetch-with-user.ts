import { getSession } from "next-auth/react"

const protocol = process.env.NODE_ENV === "development" ? "http://" : "https://"
/**
 * a fetch wrapper that adds `userId={userId}` to the query string
 */
export async function fetchWithUser(url: string, options: RequestInit = {}) {
	// TODO: figure out if this extra network call hurts performance
	const session = await getSession()
	const newUrl = new URL(url, `${protocol}${process.env.NEXT_PUBLIC_DRIFT_URL}`)
	newUrl.searchParams.append("userId", session?.user.id || "")
	return fetch(newUrl.toString(), options)
}
