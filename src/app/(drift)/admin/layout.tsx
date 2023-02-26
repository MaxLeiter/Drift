import { getMetadata } from "src/app/lib/metadata"
import { getCurrentUser } from "@lib/server/session"
import { redirect } from "next/navigation"

export default async function AdminLayout({
	children
}: {
	children: React.ReactNode
}) {
	const user = await getCurrentUser()
	const isAdmin = user?.role === "admin"

	if (!isAdmin) {
		return redirect("/")
	}

	return children
}

export const metadata = getMetadata({
	title: "Admin",
	hidden: true
})
