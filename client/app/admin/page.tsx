import { getAllPosts, getAllUsers } from "@lib/server/prisma"
import { Spinner } from "@components/spinner"
import styles from "./admin.module.css"

export function UserTable({
	users
}: {
	users?: Awaited<ReturnType<typeof getAllUsers>>
}) {
	return (
		<table className={styles.table}>
			<thead>
				<tr>
					<th>Name</th>
					<th>Email</th>
					<th>Role</th>
					<th>User ID</th>
				</tr>
			</thead>
			<tbody>
				{users?.map((user) => (
					<tr key={user.id}>
						<td>{user.name ? user.name : "no name"}</td>
						<td>{user.email}</td>
						<td>{user.role}</td>
						<td className={styles.id}>{user.id}</td>
					</tr>
				))}
				{!users && (
					<tr>
						<td colSpan={4}>
							<Spinner />
						</td>
					</tr>
				)}
			</tbody>
		</table>
	)
}

export function PostTable({
	posts
}: {
	posts?: Awaited<ReturnType<typeof getAllPosts>>
}) {
	return (
		<table className={styles.table}>
			<thead>
				<tr>
					<th>Title</th>
					<th>Author</th>
					<th>Created</th>
					<th>Visibility</th>
					<th className={styles.id}>Post ID</th>
				</tr>
			</thead>
			<tbody>
				{posts?.map((post) => (
					<tr key={post.id}>
						<td><a href={`/post/${post.id}`} target="_blank" rel="noreferrer">{post.title}</a></td>
						<td>{"author" in post ? post.author.name : "no author"}</td>
						<td>{post.createdAt.toLocaleDateString()}</td>
						<td>{post.visibility}</td>
						<td>{post.id}</td>
					</tr>
				))}
				{!posts && (
					<tr>
						<td colSpan={5}>
							<Spinner />
						</td>
					</tr>
				)}
			</tbody>
		</table>
	)
}

export default async function AdminPage() {
	const usersPromise = getAllUsers()
	const postsPromise = getAllPosts({
		withAuthor: true
	})

	const [users, posts] = await Promise.all([usersPromise, postsPromise])

	return (
		<div className={styles.wrapper}>
			<h1>Admin</h1>
			<h2>Users</h2>
			<UserTable users={users} />
			<h2>Posts</h2>
			<PostTable posts={posts} />
		</div>
	)
}
