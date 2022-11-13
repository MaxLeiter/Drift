import Tooltip from "@components/tooltip"
import { Badge } from "@geist-ui/core/dist"
import { timeAgo } from "@lib/time-ago"
import { useMemo, useState, useEffect } from "react"

const CreatedAgoBadge = ({ createdAt }: { createdAt: string | Date }) => {
	const createdDate = useMemo(() => new Date(createdAt), [createdAt])
	const [time, setTimeAgo] = useState(timeAgo(createdDate))

	useEffect(() => {
		const interval = setInterval(() => {
			setTimeAgo(timeAgo(createdDate))
		}, 1000)
		return () => clearInterval(interval)
	}, [createdDate])

	const formattedTime = `${createdDate.toLocaleDateString()} ${createdDate.toLocaleTimeString()}`
	return (
		<Badge type="secondary">
			{" "}
			<Tooltip content={formattedTime}>
				<>Created {time}</>
			</Tooltip>
		</Badge>
	)
}

export default CreatedAgoBadge
