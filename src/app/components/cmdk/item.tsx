import { Command } from "cmdk"

export default function Item({
	children,
	shortcut,
	onSelect,
	icon
}: {
	children: React.ReactNode
	shortcut?: string
	onSelect: (value: string) => void
	icon: React.ReactNode
}): JSX.Element {
	return (
		<Command.Item onSelect={onSelect}>
			{icon}
			{children}
			{shortcut ? (
				<div cmdk-shortcuts="">
					{shortcut.split(" ").map((key) => {
						return <kbd key={key}>{key}</kbd>
					})}
				</div>
			) : null}
		</Command.Item>
	)
}
