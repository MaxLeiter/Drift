import styles from "./card.module.css"

export default function Card({
	children,
	className,
	...props
}: {
	children: React.ReactNode
	className?: string
} & React.ComponentProps<"div">) {
	return (
		<div className={`${styles.card} ${className}`} {...props}>
			<div className={styles.content}>{children}</div>
		</div>
	)
}
