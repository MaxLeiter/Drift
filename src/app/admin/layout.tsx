import { getCurrentUser } from "@lib/server/session"
import { redirect } from "next/navigation"
import { PropsWithChildren } from "react"

export default async function AdminLayout({
	children
}: PropsWithChildren<unknown>) {
	const user = await getCurrentUser()
	const isAdmin = user?.role === "admin"

	if (!isAdmin) {
		return redirect("/")
	}

	return children
}
