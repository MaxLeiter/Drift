"use client"

import Password from "./sections/password"
import Profile from "./sections/profile"
import SettingsGroup from "../settings-group"

const SettingsPage = () => {
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
				<Profile />
			</SettingsGroup>
			<SettingsGroup title="Password">
				<Password />
			</SettingsGroup>
		</div>
	)
}

export default SettingsPage
