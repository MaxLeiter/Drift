import styles from "./header.module.css"
import { HeaderButtons } from "./buttons"
import MobileHeader from "./mobile"

export default function Header({
	theme,
	isAuthenticated
}: {
	theme: string
	isAuthenticated: boolean
}) {
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
