import { getAllPosts, getAllUsers } from "@lib/server/prisma"
import { getCurrentUser } from "@lib/server/session"
import { notFound } from "next/navigation"
import styles from "./components/admin.module.css"
import PostTable from "./components/post-table"
import UserTable from "./components/user-table"

const AdminPage = async () => {
	const user = await getCurrentUser()
	if (!user) {
		return notFound()
	}

	if (user.role !== "admin") {
		return notFound()
	}

	const posts = await getAllPosts()
	const users = await getAllUsers()

	return (
		<div className={styles.adminWrapper}>
			<h2>Administration</h2>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					gap: "var(--gap)"
				}}
			>
				<UserTable users={users} />
				<PostTable posts={posts} />
			</div>
		</div>
	)
}

export default AdminPage
