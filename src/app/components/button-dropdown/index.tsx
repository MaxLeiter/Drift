import Button from "@components/button"
import React, { ReactNode } from "react"
import styles from "./dropdown.module.css"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { ArrowDown } from "react-feather"
type Props = {
	type?: "primary" | "secondary"
	height?: number | string
}

type Attrs = Omit<React.HTMLAttributes<HTMLDivElement>, keyof Props>
type ButtonDropdownProps = Props & Attrs

const ButtonDropdown: React.FC<
	React.PropsWithChildren<ButtonDropdownProps>
> = ({ type, ...props }) => {
	return (
		<DropdownMenu.Root>
			<div className={styles.dropdown} style={{ height: props.height }}>
				<>
					{Array.isArray(props.children) ? props.children[0] : props.children}
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
							buttonType={type}
							className={styles.icon}
						/>
					</DropdownMenu.Trigger>
					{Array.isArray(props.children) ? (
						<DropdownMenu.Portal>
							<DropdownMenu.Content align="end">
								{(props.children as ReactNode[])
									?.slice(1)
									.map((child, index) => (
										<DropdownMenu.Item key={index}>{child}</DropdownMenu.Item>
									))}
							</DropdownMenu.Content>
						</DropdownMenu.Portal>
					) : null}
				</>
			</div>
		</DropdownMenu.Root>
	)
}

export default ButtonDropdown
