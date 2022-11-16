import styles from "./button-group.module.css"

export default function ButtonGroup({
	children,
	...props
}: {
	children: React.ReactNode | React.ReactNode[]
} & React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div className={styles["button-group"]} {...props}>
			{children}
		</div>
	)
}
