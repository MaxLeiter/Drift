import Admin from "@components/admin"
import { TOKEN_COOKIE_NAME } from "@lib/constants"
import { isUserAdmin } from "app/prisma"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"

const AdminPage = async () => {
	const driftToken = cookies().get(TOKEN_COOKIE_NAME)?.value
	if (!driftToken) {
		return notFound()
	}

	const isAdmin = await isUserAdmin(driftToken)

	if (!isAdmin) {
		return notFound()
	}

	return <Admin />
}

export default AdminPage
