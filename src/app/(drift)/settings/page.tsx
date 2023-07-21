import { getMetadata } from "src/app/lib/metadata"
import SettingsGroup from "../../components/settings-group"
import APIKeys from "./components/sections/api-keys"
import Profile from "./components/sections/profile"
import { PageTitle } from "@components/page-title"
import { PageWrapper } from "@components/page-wrapper"

export default async function SettingsPage() {
	return (
		<>
			<PageTitle>Settings</PageTitle>
			<PageWrapper>
				<SettingsGroup title="Profile">
					<Profile />
				</SettingsGroup>
				<SettingsGroup title="API Keys">
					<APIKeys />
				</SettingsGroup>
			</PageWrapper>
		</>
	)
}

export const metadata = getMetadata({
	title: "Settings",
	hidden: true
})
