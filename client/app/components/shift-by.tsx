// https://www.joshwcomeau.com/snippets/react-components/shift-by/
type Props = {
	x?: number
	y?: number
	children: React.ReactNode
}

function ShiftBy({ x = 0, y = 0, children }: Props) {
	return (
		<div
			style={{
				transform: `translate(${x}px, ${y}px)`,
				display: "inline-block"
			}}
		>
			{children}
		</div>
	)
}
export default ShiftBy
