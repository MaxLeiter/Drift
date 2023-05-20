import styles from "./header.module.css"
import { HeaderButtons } from "./buttons"
import MobileHeader from "./mobile"

export default function Header() {
	return (
		<header className={styles.header}>
			<div className={styles.tabs}>
				<div className={styles.buttons}>
					<HeaderButtons />
				</div>
			</div>
			<MobileHeader />
		</header>
	)
}
