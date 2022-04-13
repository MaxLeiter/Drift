import { Button, Fieldset, Link, Popover, useToasts } from "@geist-ui/core"
import MoreVertical from "@geist-ui/icons/moreVertical"
import { User } from "@lib/types"
import Cookies from "js-cookie"
import { useEffect, useMemo, useState } from "react"
import { adminFetcher } from "."
import Table from "rc-table"

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

	const toggleRole = async (id: number, role: "admin" | "user") => {
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

			// TODO: swr should handle updating this
			const newUsers = users?.map((user) => {
				if (user.id === id.toString()) {
					return {
						...user,
						role: role === "admin" ? "user" : ("admin" as User["role"])
					}
				}
				return user
			})
			setUsers(newUsers)
		} else {
			setToast({
				text: json.error || "Something went wrong",
				type: "error"
			})
		}
	}

	const deleteUser = async (id: number) => {
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
			render(user: any) {
				return (
					<Popover
						content={
							<div
								style={{
									width: 100,
									display: "flex",
									flexDirection: "column",
									alignItems: "center"
								}}
							>
								<Link href="#" onClick={() => toggleRole(user.id, user.role)}>
									{user.role === "admin" ? "Change role" : "Make admin"}
								</Link>
								<Link href="#" onClick={() => deleteUser(user.id)}>
									Delete user
								</Link>
							</div>
						}
						hideArrow
					>
						<Button iconRight={<MoreVertical />} auto></Button>
					</Popover>
				)
			}
		}
	]

	return (
		<Fieldset>
			<Fieldset.Title>Users</Fieldset.Title>
			{users && <Fieldset.Subtitle>{users.length} users</Fieldset.Subtitle>}
			{!users && <Fieldset.Subtitle>Loading...</Fieldset.Subtitle>}
			{users && <Table columns={usernameColumns} data={tableUsers} />}
		</Fieldset>
	)
}

export default UserTable
