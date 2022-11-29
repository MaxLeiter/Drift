import styles from "./button-group.module.css"
import clsx from "clsx"
export default function ButtonGroup({
	children,
	verticalIfMobile,
	...props
}: {
	children: React.ReactNode | React.ReactNode[]
	verticalIfMobile?: boolean
} & React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={clsx(
				props.className,
				styles["button-group"],
				verticalIfMobile && styles.verticalIfMobile
			)}
			{...props}
		>
			{children}
		</div>
	)
}
