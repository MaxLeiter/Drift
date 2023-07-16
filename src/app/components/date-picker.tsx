"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "react-feather"

import { cn } from "@lib/cn"
import { Button } from "@components/button"
import { Calendar } from "@components/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@components/popover"

export function DatePicker({
	expiresAt,
	setExpiresAt
}: {
	expiresAt?: Date
	setExpiresAt: React.Dispatch<React.SetStateAction<Date | undefined>>
}) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={"outline"}
					className={cn(
						"w-[280px] justify-start text-left font-normal",
						!expiresAt && "text-muted-foreground"
					)}
				>
					<CalendarIcon className="mr-2 h-4 w-4" />
					{expiresAt ? (
						format(expiresAt, "PPP")
					) : (
						<span>Won&apos;t expire</span>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0">
				<Calendar
					mode="single"
					selected={expiresAt}
					onSelect={(date) => {
						setExpiresAt(date)
					}}
					initialFocus
					fromDate={new Date()}
				/>
			</PopoverContent>
		</Popover>
	)
}
