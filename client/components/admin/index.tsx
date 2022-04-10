import { Text, Fieldset, Spacer, Link } from "@geist-ui/core"
import { Post, User } from "@lib/types"
import Cookies from "js-cookie"
import { useEffect, useState } from "react"
import useSWR from "swr"
import styles from "./admin.module.css"
import PostModal from "./post-modal-link"

export const adminFetcher = (url: string) =>
	fetch(url, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${Cookies.get("drift-token")}`
		}
	}).then((res) => res.json())

const Admin = () => {
	const { data: posts, error: postsError } = useSWR<Post[]>(
		"/server-api/admin/posts",
		adminFetcher
	)
	const { data: users, error: usersError } = useSWR<User[]>(
		"/server-api/admin/users",
		adminFetcher
	)
	const [postSizes, setPostSizes] = useState<{ [key: string]: number }>({})
	const byteToMB = (bytes: number) =>
		Math.round((bytes / 1024 / 1024) * 100) / 100
	useEffect(() => {
		if (posts) {
			// sum the sizes of each file per post
			const sizes = posts.reduce((acc, post) => {
				const size =
					post.files?.reduce((acc, file) => acc + file.html.length, 0) || 0
				return { ...acc, [post.id]: byteToMB(size) }
			}, {})
			setPostSizes(sizes)
		}
	}, [posts])

	return (
		<div className={styles.adminWrapper}>
			<Text h2>Administration</Text>
			<Fieldset>
				<Fieldset.Title>Users</Fieldset.Title>
				{users && <Fieldset.Subtitle>{users.length} users</Fieldset.Subtitle>}
				{!users && <Fieldset.Subtitle>Loading...</Fieldset.Subtitle>}
				{usersError && <Fieldset.Subtitle>An error occured</Fieldset.Subtitle>}
				{users && (
					<table>
						<thead>
							<tr>
								<th>Username</th>
								<th>Posts</th>
								<th>Created</th>
								<th>Role</th>
							</tr>
						</thead>
						<tbody>
							{users?.map((user) => (
								<tr key={user.id}>
									<td>{user.username}</td>
									<td>{user.posts?.length}</td>
									<td>
										{new Date(user.createdAt).toLocaleDateString()}{" "}
										{new Date(user.createdAt).toLocaleTimeString()}
									</td>
									<td>{user.role}</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</Fieldset>
			<Spacer height={1} />
			<Fieldset>
				<Fieldset.Title>Posts</Fieldset.Title>
				{posts && <Fieldset.Subtitle>{posts.length} posts</Fieldset.Subtitle>}
				{!posts && <Fieldset.Subtitle>Loading...</Fieldset.Subtitle>}
				{postsError && <Fieldset.Subtitle>An error occured</Fieldset.Subtitle>}
				{posts && (
					<table>
						<thead>
							<tr>
								<th>Title</th>
								<th>Visibility</th>
								<th>Created</th>
								<th>Author</th>
								<th>Size</th>
							</tr>
						</thead>
						<tbody>
							{posts?.map((post) => (
								<tr key={post.id}>
									<td>
										<PostModal id={post.id} />
									</td>
									<td>{post.visibility}</td>
									<td>
										{new Date(post.createdAt).toLocaleDateString()}{" "}
										{new Date(post.createdAt).toLocaleTimeString()}
									</td>
									<td>
										{post.users?.length ? (
											post.users[0].username
										) : (
											<i>Deleted</i>
										)}
									</td>
									<td>
										{postSizes[post.id] ? `${postSizes[post.id]} MB` : ""}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
				{Object.keys(postSizes).length && (
					<div style={{ float: "right" }}>
						<Text>
							Total size:{" "}
							{Object.values(postSizes).reduce((prev, curr) => prev + curr)} MB
						</Text>
					</div>
				)}
			</Fieldset>
		</div>
	)
}

export default Admin
