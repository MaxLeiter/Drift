import { getMetadata } from "src/app/lib/metadata"
import SettingsGroup from "../../components/settings-group"
import APIKeys from "./components/sections/api-keys"
import Profile from "./components/sections/profile"

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

export const metadata = getMetadata({
	title: "Settings",
	hidden: true
})
