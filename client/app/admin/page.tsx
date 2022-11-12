import { isUserAdmin } from "@lib/server/prisma"
import { getCurrentUser } from "@lib/server/session"
import Admin from "./components/admin"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"

const AdminPage = async () => {
	const user = await getCurrentUser();
	if (!user) {
		return notFound()
	}

	if (user.role !== "admin") {
		return notFound()
	}

	return <Admin />
}

export default AdminPage
