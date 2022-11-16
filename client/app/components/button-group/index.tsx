import styles from "./button-group.module.css"
import clsx from "clsx"
export default function ButtonGroup({
	children,
	vertical,
	...props
}: {
	children: React.ReactNode | React.ReactNode[]
	vertical?: boolean
} & React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={clsx(
				props.className,
				styles["button-group"],
				vertical && styles.vertical
			)}
			{...props}
		>
			{children}
		</div>
	)
}
