import { getAllPosts, getAllUsers } from "@lib/server/prisma"
import { PostTable, UserTable } from "./components/tables"

export default async function AdminPage() {
	const usersPromise = getAllUsers({
		select: {
			id: true,
			name: true,
			createdAt: true
		}
	})
	const postsPromise = getAllPosts({
		select: {
			id: true,
			title: true,
			createdAt: true,
			updatedAt: true,
			author: {
				select: {
					name: true
				}
			}
		}
	})

	const [users, posts] = await Promise.all([usersPromise, postsPromise])

	const serializedPosts = posts.map((post) => {
		return {
			...post,
			createdAt: post.createdAt.toISOString(),
			updatedAt: post.updatedAt.toISOString(),
			expiresAt: post.expiresAt?.toISOString(),
			deletedAt: post.deletedAt?.toISOString()
		}
	})

	const serializedUsers = users.map((user) => {
		return {
			...user,
			createdAt: user.createdAt.toISOString()
		}
	})

	return (
		<div>
			<h1>Admin</h1>
			<h2>Users</h2>
			<UserTable users={serializedUsers} />
			<h2>Posts</h2>
			<PostTable posts={serializedPosts} />
		</div>
	)
}
