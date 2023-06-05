"use client"

import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { buttonVariants } from "@components/button"
import { Button } from "@components/button"
import { Menu } from "react-feather"
import clsx from "clsx"
import styles from "./mobile.module.css"
import { HeaderButtons } from "./buttons"

export default function MobileHeader() {
	// TODO: this is a hack to close the radix ui menu when a next link is clicked
	const onClick = () => {
		document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }))
	}

	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger
				className={buttonVariants({ className: styles.mobileTrigger })}
				asChild
			>
				<Button aria-label="Menu">
					<Menu />
				</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Portal>
				<DropdownMenu.Content>
					{HeaderButtons().props.children.map((button: JSX.Element) => (
						<DropdownMenu.Item
							key={`mobile-${button?.key}`}
							className={styles.dropdownItem}
							onClick={onClick}
						>
							{button}
						</DropdownMenu.Item>
					))}
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	)
}
