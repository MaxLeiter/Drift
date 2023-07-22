// https://www.joshwcomeau.com/snippets/react-components/fade-in/
import React from "react"
import styles from "./fade.module.css"
import { cn } from "@lib/cn"

function FadeIn({
	duration = 300,
	delay = 0,
	children,
	as,
	className,
	...delegated
}: {
	duration?: number
	delay?: number
	children: React.ReactNode
	as?: React.ElementType | JSX.Element
} & React.HTMLAttributes<HTMLElement>) {
	if (as !== null && typeof as === "object") {
		return React.cloneElement(as, {
			className: cn(as.props.className, styles.fadeIn, className),
			style: {
				...(as.props.style || {}),
				animationDuration: duration + "ms",
				animationDelay: delay + "ms"
			}
		})
	}
	const Element = as || "div"
	return (
		<Element
			{...delegated}
			className={cn(styles.fadeIn, className)}
			style={{
				...(delegated.style || {}),
				animationDuration: duration + "ms",
				animationDelay: delay + "ms"
			}}
		>
			{children}
		</Element>
	)
}

export default FadeIn
