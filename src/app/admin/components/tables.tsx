"use client"

import Button from "@components/button"
import ButtonDropdown from "@components/button-dropdown"
import { Spinner } from "@components/spinner"
import { useToasts } from "@components/toasts"
import { Post, User } from "@lib/server/prisma"
import { useState } from "react"
import styles from "./table.module.css"

export function UserTable({
	users: initialUsers
}: {
	users?: {
		createdAt: string
		posts?: Post[]
		id: string
		email: string | null
		role: string | null
		displayName: string | null

	}[]
}) {
	const { setToast } = useToasts()
	const [users, setUsers] = useState<typeof initialUsers>(initialUsers)

	const deleteUser = async (id: string) => {
		try {
			const res = await fetch("/api/admin?action=delete-user", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					userId: id
				})
			})

			if (res.status === 200) {
				setToast({
					message: "User deleted",
					type: "success"
				})
				setUsers(users?.filter((user) => user.id !== id))
			}
		} catch (err) {
			console.error(err)
			setToast({
				message: "Error deleting user",
				type: "error"
			})
		}
	}

	return (
		<table className={styles.table}>
			<thead>
				<tr>
					<th>Name</th>
					<th>Email</th>
					<th>Role</th>
					<th>User ID</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				{!users ? (
					<tr>
						<td colSpan={4}>
							<Spinner />
						</td>
					</tr>
				) : null}
				{users?.map((user) => (
					<tr key={user.id}>
						<td>{user.displayName ? user.displayName : "no name"}</td>
						<td>{user.email}</td>
						<td>{user.role}</td>
						<td className={styles.id} title={user.id}>
							{user.id}
						</td>
						<td>
							<Button onClick={() => deleteUser(user.id)}>Delete</Button>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	)
}

export function PostTable({
	posts
}: {
	posts?: {
		createdAt: string
		id: string
		author?: User | null
		title: string
		visibility: string
	}[]
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
				{!posts ? (
					<tr>
						<td colSpan={5}>
							<Spinner />
						</td>
					</tr>
				) : null}
				{posts?.map((post) => (
					<tr key={post.id}>
						<td>
							<a href={`/post/${post.id}`} target="_blank" rel="noreferrer">
								{post.title}
							</a>
						</td>
						<td>{"author" in post ? post.author?.name : "no author"}</td>
						<td>{new Date(post.createdAt).toLocaleDateString()}</td>
						<td>{post.visibility}</td>
						<td>{post.id}</td>
					</tr>
				))}
			</tbody>
		</table>
	)
}
