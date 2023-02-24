"use client"

import * as RadixTooltip from "@radix-ui/react-tooltip"
import styles from "./tooltip.module.css"

const Tooltip = ({
	children,
	content,
	className,
	...props
}: {
	children: React.ReactNode
	content: React.ReactNode
	className?: string
} & RadixTooltip.TooltipProps) => {
	return (
		<RadixTooltip.Root {...props}>
			<RadixTooltip.Trigger asChild className={className}>
				{children}
			</RadixTooltip.Trigger>

			<RadixTooltip.Content>
				<div className={styles.tooltip}>{content}</div>
			</RadixTooltip.Content>
		</RadixTooltip.Root>
	)
}

export default Tooltip
