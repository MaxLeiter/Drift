import styles from "./header.module.css"
import { getButtons, HeaderButtons } from "./buttons"
import MobileHeader from "./mobile"
import { useMemo } from "react"

export default function Header({
	theme,
	isAuthenticated
}: {
	theme: string
	isAuthenticated: boolean
}) {
	const memoHeaderButtons = useMemo(
		() => (
			<>
				<HeaderButtons isAuthenticated={isAuthenticated} theme={theme} />
			</>
		),
		[isAuthenticated, theme]
	)

	return (
		<header className={styles.header}>
			<div className={styles.tabs}>
				<div className={styles.buttons}>
					<HeaderButtons isAuthenticated={isAuthenticated} theme={theme} />
				</div>
			</div>
			<MobileHeader isAuthenticated={isAuthenticated} theme={theme} />
		</header>
	)
}
