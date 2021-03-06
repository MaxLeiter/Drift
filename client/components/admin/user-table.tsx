import { Fieldset, useToasts } from "@geist-ui/core"
import { User } from "@lib/types"
import { useEffect, useMemo, useState } from "react"
import { adminFetcher } from "."
import Table from "rc-table"
import SettingsGroup from "@components/settings-group"
import ActionDropdown from "./action-dropdown"

const UserTable = () => {
	const [users, setUsers] = useState<User[]>()
	const { setToast } = useToasts()

	useEffect(() => {
		const fetchUsers = async () => {
			const res = await adminFetcher("/users")
			const data = await res.json()
			setUsers(data)
		}
		fetchUsers()
	}, [])

	const toggleRole = async (id: string, role: "admin" | "user") => {
		const res = await adminFetcher("/users/toggle-role", {
			method: "POST",
			body: { id, role }
		})

		const json = await res.json()

		if (res.status === 200) {
			setToast({
				text: "Role updated",
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
				text: json.error || "Something went wrong",
				type: "error"
			})
		}
	}

	const deleteUser = async (id: string) => {
		const confirm = window.confirm("Are you sure you want to delete this user?")
		if (!confirm) return
		const res = await adminFetcher(`/users/${id}`, {
			method: "DELETE"
		})

		const json = await res.json()

		if (res.status === 200) {
			setToast({
				text: "User deleted",
				type: "success"
			})
		} else {
			setToast({
				text: json.error || "Something went wrong",
				type: "error"
			})
		}
	}

	const tableUsers = useMemo(
		() =>
			users?.map((user) => {
				return {
					id: user.id,
					username: user.username,
					posts: user.posts?.length || 0,
					createdAt: `${new Date(
						user.createdAt
					).toLocaleDateString()} ${new Date(
						user.createdAt
					).toLocaleTimeString()}`,
					role: user.role,
					actions: ""
				}
			}),
		[users]
	)

	const usernameColumns = [
		{
			title: "Username",
			dataIndex: "username",
			key: "username",
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
