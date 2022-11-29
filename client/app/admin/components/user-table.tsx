"use client"
import { Fieldset } from "@geist-ui/core/dist"
import Table from "rc-table"
import ActionDropdown from "./action-dropdown"
import SettingsGroup from "@components/settings-group"
import type { User, UserWithPosts } from "@lib/server/prisma"
import { useState } from "react"
import { useToasts } from "@components/toasts"

const UserTable = ({ users: initial }: { users: UserWithPosts[] }) => {
	const [users, setUsers] = useState(initial)
	const { setToast } = useToasts()

	const toggleRole = async (id: string, role: "admin" | "user") => {
		const res = await fetch("/api/admin?action=toggle-role", {
			method: "POST",
			body: JSON.stringify({
				userId: id,
				role
			})
		})

		if (res.status === 200) {
			setToast({
				message: "Role updated",
				type: "success"
			})

			setUsers((users) => {
				const newUsers = users?.map((user) => {
					if (user.id === id) {
						return {
							...user,
							role
						}
					}
					return user
				})
				return newUsers
			})
		} else {
			setToast({
				message: "Something went wrong",
				type: "error"
			})
		}
	}

	const deleteUser = async (id: string) => {
		const confirm = window.confirm("Are you sure you want to delete this user?")
		if (!confirm) return
		// const res = await adminFetcher(`/users/${id}`, {
		// 	method: "DELETE"
		// })
		const res = await fetch("/api/admin?action=delete-user", {
			method: "POST",
			body: JSON.stringify({
				userId: id
			})
		})

		setUsers((users) => {
			const newUsers = users?.filter((user) => user.id !== id)
			return newUsers
		})

		if (res.status === 200) {
			setToast({
				message: "User deleted",
				type: "success"
			})
		} else {
			setToast({
				message: "Something went wrong",
				type: "error"
			})
		}
	}

	const tableUsers = users?.map((user) => {
		return {
			id: user.id,
			displayName: user.displayName,
			posts: user.posts?.length || 0,
			createdAt: `${new Date(user.createdAt).toLocaleDateString()} ${new Date(
				user.createdAt
			).toLocaleTimeString()}`,
			role: user.role,
			actions: ""
		}
	})

	const usernameColumns = [
		{
			title: "Name",
			dataIndex: "displayName",
			key: "displayName",
			width: 50
		},
		{
			title: "Posts",
			dataIndex: "posts",
			key: "posts",
			width: 10
		},
		{
			title: "Created",
			dataIndex: "createdAt",
			key: "createdAt",
			width: 100
		},
		{
			title: "Role",
			dataIndex: "role",
			key: "role",
			width: 50
		},
		{
			title: "Actions",
			dataIndex: "",
			key: "actions",
			width: 50,
			render(user: User) {
				return (
					<ActionDropdown
						title="Actions"
						actions={[
							{
								title: user.role === "admin" ? "Change role" : "Make admin",
								onClick: () =>
									toggleRole(user.id, user.role === "admin" ? "user" : "admin")
							},
							{
								title: "Delete",
								onClick: () => deleteUser(user.id)
							}
						]}
					/>
				)
			}
		}
	]

	return (
		<SettingsGroup title="Users">
			{!users && <Fieldset.Subtitle>Loading...</Fieldset.Subtitle>}
			{users && (
				<Fieldset.Subtitle>
					<h5>{users.length} users</h5>
				</Fieldset.Subtitle>
			)}
			{users && <Table columns={usernameColumns} data={tableUsers} />}
		</SettingsGroup>
	)
}

export default UserTable
