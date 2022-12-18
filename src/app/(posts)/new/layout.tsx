import { getCurrentUser } from "@lib/server/session"
import { redirect } from "next/navigation"

export default function NewLayout({ children }: { children: React.ReactNode }) {
	return <>{children}</>
}
