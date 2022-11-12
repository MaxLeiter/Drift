import styles from "./button.module.css"
import { forwardRef, Ref } from "react"

type Props = React.HTMLProps<HTMLButtonElement> & {
	children: React.ReactNode
	buttonType?: "primary" | "secondary"
	className?: string
	onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
	iconRight?: React.ReactNode
}

// eslint-disable-next-line react/display-name
const Button = forwardRef<HTMLButtonElement, Props>(
	(
		{
			children,
			onClick,
			className,
			buttonType = "primary",
			type = "button",
			disabled = false,
			iconRight,
			...props
		},
		ref
	) => {
		return (
			<button
				ref={ref}
				className={`${styles.button} ${styles[type]} ${className}`}
				disabled={disabled}
				onClick={onClick}
				{...props}
			>
				{children}
				{iconRight && (
					<span className={`${styles.icon} ${styles.iconRight}`}>
						{iconRight}
					</span>
				)}
			</button>
		)
	}
)

export default Button
