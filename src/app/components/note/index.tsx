import clsx from "clsx"
import styles from "./note.module.css"

const Note = ({
	type = "info",
	children,
	className,
	...props
}: {
	type: "info" | "warning" | "error"
	children: React.ReactNode
} & React.ComponentProps<"div">) => (
	<div className={clsx(className, styles.note, styles[type])} {...props}>
		{children}
	</div>
)

export default Note
