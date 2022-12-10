import styles from "./badge.module.css"
type BadgeProps = {
	type: "primary" | "secondary" | "error" | "warning"
	children: React.ReactNode
}

const Badge = ({ type, children }: BadgeProps) => {
	return (
		<div className={styles.container}>
			<div className={`${styles.badge} ${styles[type]}`}>
				<span className={styles.badgeText}>{children}</span>
			</div>
		</div>
	)
}

export default Badge
