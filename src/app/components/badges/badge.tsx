import React from "react"
import styles from "./badge.module.css"
type BadgeProps = {
	type: "primary" | "secondary" | "error" | "warning"
	children: React.ReactNode
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
	({ type, children }: BadgeProps, ref) => {
		return (
			<div className={styles.container}>
				<div className={`${styles.badge} ${styles[type]}`} ref={ref}>
					{children}
				</div>
			</div>
		)
	}
)

Badge.displayName = "Badge"

export default Badge
