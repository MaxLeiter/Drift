"use client"

import Tooltip from "@components/tooltip"
import { timeUntil } from "src/app/lib/time-ago"
import { useEffect, useMemo, useState } from "react"
import Badge from "../badge"

const ExpirationBadge = ({
	postExpirationDate
}: {
	postExpirationDate: Date | string | undefined
	onExpires?: () => void
}) => {
	const expirationDate = useMemo(
		() => (postExpirationDate ? new Date(postExpirationDate) : undefined),
		[postExpirationDate]
	)
	const [timeUntilString, setTimeUntil] = useState<string | null>(
		expirationDate ? timeUntil(expirationDate) : null
	)

	useEffect(() => {
		let interval: NodeJS.Timer | null = null
		if (expirationDate) {
			interval = setInterval(() => {
				if (expirationDate) {
					setTimeUntil(timeUntil(expirationDate))
				}
			}, 1000)
		}

		return () => {
			if (interval) {
				clearInterval(interval)
			}
		}
	}, [expirationDate])

	const isExpired = useMemo(() => {
		if (!expirationDate) {
			return false
		}
		return expirationDate < new Date()
	}, [expirationDate])

	if (!expirationDate) {
		return null
	}

	return (
		<Badge type={isExpired ? "error" : "warning"}>
			<Tooltip
				content={`${expirationDate.toLocaleDateString()} ${expirationDate.toLocaleTimeString()}`}
			>
				<span suppressHydrationWarning>
					{isExpired ? "Expired" : `Expires ${timeUntilString}`}
				</span>
			</Tooltip>
		</Badge>
	)
}

export default ExpirationBadge
