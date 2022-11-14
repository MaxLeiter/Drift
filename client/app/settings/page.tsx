import Header from "@components/header"
import SettingsGroup from "../components/settings-group"
import Password from "app/settings/components/sections/password"
import Profile from "app/settings/components/sections/profile"
import { authOptions } from "@lib/server/auth"
import { getCurrentUser } from "@lib/server/session"
import { redirect } from "next/navigation"

export default async function SettingsPage() {
	const user = await getCurrentUser()

	if (!user) {
		return redirect(authOptions.pages?.signIn || "/new")
	}

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				gap: "var(--gap)",
				marginBottom: "var(--gap)"
			}}
		>
			<h1>Settings</h1>
			<SettingsGroup title="Profile">
				<Profile user={user} />
			</SettingsGroup>
			{/* <SettingsGroup title="Password">
				<Password />
			</SettingsGroup> */}
		</div>
	)
}
