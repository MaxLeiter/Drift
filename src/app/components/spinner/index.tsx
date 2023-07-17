import { cn } from "@lib/cn"
import styles from "./spinner.module.css"

export const Spinner = ({ className }: { className?: string }) => (
	<div className={cn(styles.spinner, className)} />
)
