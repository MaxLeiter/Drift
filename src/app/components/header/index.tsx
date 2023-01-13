"use client"
import styles from "./header.module.css"

// import useUserData from "@lib/hooks/use-user-data"
import Link from "@components/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import Button from "@components/button"
import clsx from "clsx"
import { useTheme } from "next-themes"
import {
	GitHub,
	Home,
	Menu,
	Moon,
	PlusCircle,
	Settings,
	Sun,
	User,
	UserPlus,
	UserX
} from "react-feather"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import buttonStyles from "@components/button/button.module.css"
import { useMemo } from "react"
import { useSessionSWR } from "@lib/use-session-swr"

type Tab = {
	name: string
	icon: JSX.Element
	value: string
	onClick?: () => void
	href?: string
}

const Header = () => {
	const { isAuthenticated, isAdmin, isLoading, mutate } = useSessionSWR()

	const pathname = usePathname()
	const { setTheme, resolvedTheme } = useTheme()

	const getButton = (tab: Tab) => {
		const isActive = `${pathname}` === tab.href
		const activeStyle = isActive ? styles.active : undefined
		if (tab.onClick) {
			return (
				<Button
					key={tab.value}
					iconLeft={tab.icon}
					onClick={tab.onClick}
					className={activeStyle}
					aria-label={tab.name}
					aria-current={isActive ? "page" : undefined}
					data-tab={tab.value}
				>
					{tab.name ? tab.name : undefined}
				</Button>
			)
		} else if (tab.href) {
			return (
				<Link key={tab.value} href={tab.href} data-tab={tab.value}>
					<Button className={activeStyle} iconLeft={tab.icon}>
						{tab.name ? tab.name : undefined}
					</Button>
				</Link>
			)
		}
	}

	const pages = useMemo(() => {
		const defaultPages: Tab[] = [
			{
				name: "GitHub",
				href: "https://github.com/maxleiter/drift",
				icon: <GitHub />,
				value: "github"
			}
		]

		if (isAdmin) {
			defaultPages.push({
				name: "Admin",
				icon: <Settings />,
				value: "admin",
				href: "/admin"
			})
		}

		defaultPages.push({
			name: "Theme",
			onClick: function () {
				setTheme(resolvedTheme === "light" ? "dark" : "light")
			},
			icon: resolvedTheme === "light" ? <Moon /> : <Sun />,
			value: "theme"
		})

		if (isAuthenticated)
			return [
				{
					name: "New",
					icon: <PlusCircle />,
					value: "new",
					href: "/new"
				},
				{
					name: "Yours",
					icon: <User />,
					value: "yours",
					href: "/mine"
				},
				{
					name: "Settings",
					icon: <Settings />,
					value: "settings",
					href: "/settings"
				},
				...defaultPages,
				{
					name: "Sign Out",
					icon: <UserX />,
					value: "signout",
					onClick: () => {
						mutate(undefined)
						signOut({
							callbackUrl: "/"
						})
					}
				}
			]
		else
			return [
				{
					name: "Home",
					icon: <Home />,
					value: "home",
					href: "/"
				},
				...defaultPages,
				{
					name: "Sign in",
					icon: <User />,
					value: "signin",
					href: "/signin"
				},
				{
					name: "Sign up",
					icon: <UserPlus />,
					value: "signup",
					href: "/signup"
				}
			]
	}, [isAdmin, resolvedTheme, isAuthenticated, setTheme, mutate])

	const buttons = pages.map(getButton)

	// TODO: this is a hack to close the radix ui menu when a next link is clicked
	const onClick = () => {
		document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }))
	}

	return (
		<header
			className={clsx(styles.header, {
				[styles.loading]: isLoading
			})}
		>
			<div className={styles.tabs}>
				<div className={styles.buttons}>{buttons}</div>
			</div>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger
					className={clsx(buttonStyles.button, styles.mobile)}
					asChild
				>
					<Button aria-label="Menu">
						<Menu />
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Portal>
					<DropdownMenu.Content className={styles.contentWrapper}>
						{buttons.map((button) => (
							<DropdownMenu.Item
								key={button?.key}
								className={styles.dropdownItem}
								onClick={onClick}
							>
								{button}
							</DropdownMenu.Item>
						))}
					</DropdownMenu.Content>
				</DropdownMenu.Portal>
			</DropdownMenu.Root>
		</header>
	)
}

export default Header
