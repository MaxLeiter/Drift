import React from "react"
import styles from "./input.module.css"

type Props = React.HTMLProps<HTMLInputElement> & {
	label?: string
	fontSize?: number | string
}

// eslint-disable-next-line react/display-name
const Input = React.forwardRef<HTMLInputElement, Props>(
	({ label, className, ...props }, ref) => {
		return (
			<div className={styles.wrapper}>
				{label && <label className={styles.label}>{label}</label>}
				<input
					ref={ref}
					className={className ? `${styles.input} ${className}` : styles.input}
					{...props}
				/>
			</div>
		)
	}
)

export default Input
