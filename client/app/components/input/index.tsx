import clsx from "clsx"
import React from "react"
import styles from "./input.module.css"

type Props = React.HTMLProps<HTMLInputElement> & {
	label?: string
	width?: number | string
	height?: number | string
	labelClassName?: string
}

// eslint-disable-next-line react/display-name
const Input = React.forwardRef<HTMLInputElement, Props>(
	({ label, className, width, height, labelClassName, ...props }, ref) => {
		return (
			<div
				className={styles.wrapper}
				style={{
					width,
					height
				}}
			>
				{label && (
					<label
						aria-labelledby={label}
						className={clsx(styles.label, labelClassName)}
					>
						{label}
					</label>
				)}
				<input
					ref={ref}
					id={label}
					className={clsx(styles.input, label && styles.withLabel, className)}
					{...props}
					style={{
						width,
						height,
						...(props.style || {})
					}}
				/>
			</div>
		)
	}
)

export default Input
