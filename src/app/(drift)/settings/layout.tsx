export default function SettingsLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<>
			<h1>Settings</h1>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: "var(--gap)",
					marginBottom: "var(--gap)",
					marginTop: "var(--gap)"
				}}
			>
				{children}
			</div>
		</>
	)
}
