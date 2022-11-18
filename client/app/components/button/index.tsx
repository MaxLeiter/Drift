import styles from "./button.module.css"
import { forwardRef, Ref } from "react"

type Props = React.HTMLProps<HTMLButtonElement> & {
	children?: React.ReactNode
	buttonType?: "primary" | "secondary"
	className?: string
	onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
	iconRight?: React.ReactNode
	iconLeft?: React.ReactNode
	height?: string | number
	width?: string | number
	padding?: string | number
	margin?: string | number
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
			iconLeft,
			height,
			width,
			padding,
			margin,
			...props
		},
		ref
	) => {
		return (
			<button
				ref={ref}
				className={`${styles.button} ${styles[type]} ${className || ""}`}
				disabled={disabled}
				onClick={onClick}
				style={{ height, width, margin, padding }}
				{...props}
			>
				{children && iconLeft && (
					<span className={`${styles.icon} ${styles.iconLeft}`}>
						{iconLeft}
					</span>
				)}
				{children ? (
					children
				) : (
					<span className={`${styles.icon}`}>{iconLeft || iconRight}</span>
				)}
				{children && iconRight && (
					<span className={`${styles.icon} ${styles.iconRight}`}>
						{iconRight}
					</span>
				)}
			</button>
		)
	}
)

export default Button
