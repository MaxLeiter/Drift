import { getCurrentUser } from "@lib/server/session"
import { redirect } from "next/navigation"

export default function NewLayout({ children }: { children: React.ReactNode }) {
	const user = getCurrentUser()
	if (!user) {
		return redirect("/new")
	}

	return <>{children}</>
}
