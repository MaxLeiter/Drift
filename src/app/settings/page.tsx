import SettingsGroup from "../components/settings-group"
import Profile from "app/settings/components/sections/profile"

export default async function SettingsPage() {
	return (
		<SettingsGroup title="Profile">
			<Profile />
		</SettingsGroup>
	)
}
