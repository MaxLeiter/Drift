import {
	getAllPosts,
	getAllUsers,
	PostWithFiles,
	serverPostToClientPost,
	ServerPostWithFiles
} from "@lib/server/prisma"
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

	const serializedPosts = posts.map((post) =>
		serverPostToClientPost(post as ServerPostWithFiles)
	) as PostWithFiles[]

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
			{/* @ts-expect-error Type 'unknown' is not assignable to type  */}
			<UserTable users={serializedUsers as unknown} />
			<h2>Posts</h2>
			<PostTable posts={serializedPosts} />
		</div>
	)
}
