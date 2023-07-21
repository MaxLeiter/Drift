import { PageTitle } from "@components/page-title"
import { PageWrapper } from "@components/page-wrapper"
import SettingsGroup from "@components/settings-group"

export default function SettingsLoading() {
	return (
		<>
			<PageTitle>Settings</PageTitle>
			<PageWrapper>
				<SettingsGroup skeleton />
				<SettingsGroup skeleton />
			</PageWrapper>
		</>
	)
}
