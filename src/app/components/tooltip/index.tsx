"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@lib/cn"

const TooltipWrapper = ({
	children,
	content,
	className,
	...props
}: {
	children: React.ReactNode
	content: React.ReactNode
	className?: string
} & TooltipPrimitive.TooltipProps) => {
	return (
		<TooltipProvider>
			<Tooltip {...props}>
				<TooltipTrigger asChild className={className}>
					{children}
				</TooltipTrigger>

				<TooltipContent>{content}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}

// export TooltipWrapper as Tooltip
export { TooltipWrapper as Tooltip }

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
	React.ElementRef<typeof TooltipPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
	<TooltipPrimitive.Content
		ref={ref}
		sideOffset={sideOffset}
		className={cn(
			"z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in duration-75 fade-in-50 data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1",
			className
		)}
		{...props}
	/>
))

TooltipContent.displayName = TooltipPrimitive.Content.displayName
