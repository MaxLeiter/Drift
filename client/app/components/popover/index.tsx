// largely from https://github.com/shadcn/taxonomy

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import clsx from "clsx"
import styles from "./popover.module.css"

type PopoverProps = PopoverPrimitive.PopoverProps

export function Popover({ ...props }: PopoverProps) {
	return <PopoverPrimitive.Root {...props} />
}

Popover.Trigger = React.forwardRef<
	HTMLButtonElement,
	PopoverPrimitive.PopoverTriggerProps
>(function PopoverTrigger({ ...props }, ref) {
	return <PopoverPrimitive.Trigger {...props} ref={ref} />
})

Popover.Portal = PopoverPrimitive.Portal

Popover.Content = React.forwardRef<
	HTMLDivElement,
	PopoverPrimitive.PopoverContentProps
>(function PopoverContent({ className, ...props }, ref) {
	return (
		<PopoverPrimitive.Content
			ref={ref}
			align="end"
			className={clsx(styles.root, className)}
			{...props}
		/>
	)
})
