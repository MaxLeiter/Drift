"use client"

import { Card } from "@geist-ui/core/dist"
import * as RadixTooltip from "@radix-ui/react-tooltip"
import "./tooltip.css"

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
			<RadixTooltip.Trigger asChild className={className}>{children}</RadixTooltip.Trigger>

			<RadixTooltip.Content>
				<Card className="tooltip">
					<Card.Body margin={0} padding={1 / 2}>
						{content}
					</Card.Body>
				</Card>
			</RadixTooltip.Content>
		</RadixTooltip.Root>
	)
}

export default Tooltip
