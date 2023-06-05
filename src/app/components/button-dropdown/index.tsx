import { Button } from "@components/button"
import React, { ComponentProps, ReactNode } from "react"
import styles from "./dropdown.module.css"
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuPortal,
	DropdownMenuContent,
	DropdownMenuItem
} from "@components/dropdown-menu"
import { ArrowDown } from "react-feather"

type ButtonDropdownProps = ComponentProps<typeof DropdownMenu>

const ButtonDropdown: React.FC<React.PropsWithChildren<ButtonDropdownProps>> = (
	props
) => {
	return (
		<DropdownMenu>
			<div className={styles.dropdown}>
				<>
					{Array.isArray(props.children) ? props.children[0] : props.children}
					<DropdownMenuTrigger asChild>
						<Button>
							<ArrowDown height={20} />
						</Button>
					</DropdownMenuTrigger>
					{Array.isArray(props.children) ? (
						<DropdownMenuPortal>
							<DropdownMenuContent align="end">
								{(props.children as ReactNode[])
									?.slice(1)
									.map((child, index) => (
										<DropdownMenuItem key={index}>{child}</DropdownMenuItem>
									))}
							</DropdownMenuContent>
						</DropdownMenuPortal>
					) : null}
				</>
			</div>
		</DropdownMenu>
	)
}

export default ButtonDropdown
