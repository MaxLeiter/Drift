"use client"
import { useToasts } from "@components/toasts"
import Tooltip from "@components/tooltip"
import { copyToClipboard } from "src/app/lib/copy-to-clipboard"
import { timeAgo } from "src/app/lib/time-ago"
import { useMemo, useState, useEffect } from "react"
import Badge from "../badge"

const CreatedAgoBadge = ({ createdAt }: { createdAt: string | Date }) => {
	const createdDate = useMemo(() => new Date(createdAt), [createdAt])
	const [time, setTimeAgo] = useState(timeAgo(createdDate))

	const { setToast } = useToasts()
	useEffect(() => {
		const interval = setInterval(() => {
			setTimeAgo(timeAgo(createdDate))
		}, 1000)
		return () => clearInterval(interval)
	}, [createdDate])

	function onClick() {
		copyToClipboard(createdDate.toISOString())
		setToast({
			message: "Copied to clipboard",
			type: "success"
		})
	}

	const formattedTime = `${createdDate.toLocaleDateString()} ${createdDate.toLocaleTimeString()}`
	return (
		// TODO: investigate tooltip not showing
		<Tooltip content={formattedTime}>
			<Badge type="secondary" onClick={onClick}>
				{" "}
				<>{time}</>
			</Badge>
		</Tooltip>
	)
}

export default CreatedAgoBadge
