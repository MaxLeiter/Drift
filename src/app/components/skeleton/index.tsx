import { cn } from "@lib/cn"

export default function Skeleton({
	width = 100,
	height = 24,
	borderRadius = 4,
	style
}: {
	width?: number | string
	height?: number | string
	borderRadius?: number | string
	style?: React.CSSProperties
}) {
	return (
		<div
			className={cn("animate-pulse bg-gray-300 dark:bg-gray-800")}
			style={{
				width,
				height,
				borderRadius,
				...style
			}}
		/>
	)
}
