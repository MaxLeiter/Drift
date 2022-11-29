import Button from "@components/button"
import React from "react"
import styles from "./dropdown.module.css"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { ArrowDown } from "react-feather"
type Props = {
	type?: "primary" | "secondary"
	loading?: boolean
	disabled?: boolean
	className?: string
	iconHeight?: number
}

type Attrs = Omit<React.HTMLAttributes<any>, keyof Props>
type ButtonDropdownProps = Props & Attrs

const ButtonDropdown: React.FC<
	React.PropsWithChildren<ButtonDropdownProps>
> = ({ type, className, disabled, loading, iconHeight = 24, ...props }) => {
	if (!Array.isArray(props.children)) {
		return null
	}

	return (
		<DropdownMenu.Root>
			<div className={styles.dropdown}>
				{props.children[0]}
				<DropdownMenu.Trigger
					style={{
						display: "flex",
						flexDirection: "row",
						justifyContent: "flex-end"
					}}
					asChild
				>
					<Button
						iconLeft={<ArrowDown />}
						type={type}
						className={styles.icon}
					/>
				</DropdownMenu.Trigger>
				<DropdownMenu.Portal>
					<DropdownMenu.Content align="end">
						{props.children.slice(1).map((child, index) => (
							<DropdownMenu.Item key={index}>{child}</DropdownMenu.Item>
						))}
					</DropdownMenu.Content>
				</DropdownMenu.Portal>
			</div>
		</DropdownMenu.Root>
	)
}

export default ButtonDropdown
