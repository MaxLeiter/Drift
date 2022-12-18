import SettingsGroup from "../components/settings-group"
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
		<SettingsGroup title="Profile">
			<Profile user={user} />
		</SettingsGroup>
	)
}
