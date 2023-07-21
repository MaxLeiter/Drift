import { TypographyH1, TypographyH2 } from "@components/typography"
import { PostTable, UserTable } from "./components/tables"

export default function AdminLoading() {
	return (
		<div>
			<TypographyH1>Admin</TypographyH1>
			<TypographyH2>Users</TypographyH2>
			<UserTable />
			<TypographyH2>Posts</TypographyH2>
			<PostTable />
		</div>
	)
}
