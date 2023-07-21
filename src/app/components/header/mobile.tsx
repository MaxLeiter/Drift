"use client"

import { Button, buttonVariants } from "@components/button"
import { Menu } from "react-feather"
import { HeaderButtons } from "./buttons"
import * as DropdownMenu from "@components/dropdown-menu"
import React from "react"

export default function MobileHeader() {
	// TODO: this is a hack to close the radix ui menu when a next link is clicked
	const onClick = () => {
		document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }))
	}

	return (
		<DropdownMenu.DropdownMenu>
			<DropdownMenu.DropdownMenuTrigger
				className={buttonVariants({ variant: "ghost" })}
				asChild
			>
				<Button aria-label="Menu" variant={"ghost"}>
					<Menu />
				</Button>
			</DropdownMenu.DropdownMenuTrigger>
			<DropdownMenu.DropdownMenuPortal>
				<DropdownMenu.DropdownMenuContent>
					{HeaderButtons().props.children.map((button: JSX.Element) => (
						<DropdownMenu.DropdownMenuItem
							key={`mobile-${button?.key}`}
							onClick={onClick}
						>
							{button}
						</DropdownMenu.DropdownMenuItem>
					))}
				</DropdownMenu.DropdownMenuContent>
			</DropdownMenu.DropdownMenuPortal>
		</DropdownMenu.DropdownMenu>
	)
}
