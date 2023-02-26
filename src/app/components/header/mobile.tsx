import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import buttonStyles from "@components/button/button.module.css"
import Button from "@components/button"
import { Menu } from "react-feather"
import clsx from "clsx"
import styles from "./mobile.module.css"

export default function MobileHeader({ buttons }: { buttons: JSX.Element[] }) {
	// TODO: this is a hack to close the radix ui menu when a next link is clicked
	const onClick = () => {
		document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }))
	}

	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger
				className={clsx(buttonStyles.button, styles.mobileTrigger)}
				asChild
			>
				<Button aria-label="Menu" height="auto">
					<Menu />
				</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Portal>
				<DropdownMenu.Content>
					{buttons.map((button) => (
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
