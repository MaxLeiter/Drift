import styles from "./note.module.css"

const Note = ({
	type = "info",
	children,
	...props
}: {
	type: "info" | "warning" | "error"
	children: React.ReactNode
} & React.ComponentProps<"div">) => (
	<div className={`${styles.note} ${styles[type]}`} {...props}>
		{children}
	</div>
)

export default Note
