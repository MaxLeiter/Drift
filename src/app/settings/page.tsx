import SettingsGroup from "../components/settings-group"
import Profile from "app/settings/components/sections/profile"
import APIKeys from "./components/sections/api-keys"

export default async function SettingsPage() {
	return (
		<>
			<SettingsGroup title="Profile">
				<Profile />
			</SettingsGroup>
			<SettingsGroup title="API Keys">
				<APIKeys />
			</SettingsGroup>
		</>
	)
}
