import { PostTable, UserTable } from "./page"

export default function AdminLoading() {
	return (
		<div>
			<h1>Admin</h1>
			<h2>Users</h2>
			<UserTable />
			<h2>Posts</h2>
			<PostTable />
		</div>
	)
}
