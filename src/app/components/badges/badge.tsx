import React from "react"
import styles from "./badge.module.css"
type BadgeProps = {
	type: "primary" | "secondary" | "error" | "warning"
	children: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement>

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
	({ type, children, ...rest }: BadgeProps, ref) => {
		return (
			<div className={styles.container} {...rest}>
				<div className={`${styles.badge} ${styles[type]}`} ref={ref}>
					{children}
				</div>
			</div>
		)
	}
)

Badge.displayName = "Badge"

export default Badge
