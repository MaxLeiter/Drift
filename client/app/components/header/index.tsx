"use client"
import styles from "./header.module.css"

// import useUserData from "@lib/hooks/use-user-data"
import Link from "@components/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import Button from "@components/button"
import clsx from "clsx"
import { useTheme } from "@wits/next-themes"
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
import { useEffect, useMemo, useState } from "react"

type Tab = {
	name: string
	icon: JSX.Element
	value: string
	onClick?: () => void
	href?: string
}

const Header = () => {
	const session = useSession()
	const isSignedIn = session?.status === "authenticated"
	const isAdmin = session?.data?.user?.role === "admin"
	const isLoading = session?.status === "loading"

	const pathname = usePathname()
	const { setTheme, resolvedTheme } = useTheme()

	const getButton = (tab: Tab) => {
		const isActive = pathname === tab.href
		const activeStyle = isActive ? styles.active : ""
		if (tab.onClick) {
			return (
				<Button
					key={tab.value}
					iconLeft={tab.icon}
					onClick={tab.onClick}
					className={clsx(styles.tab, activeStyle)}
					aria-label={tab.name}
					aria-current={isActive ? "page" : undefined}
					data-tab={tab.value}
				>
					{tab.name ? tab.name : undefined}
				</Button>
			)
		} else if (tab.href) {
			return (
				<Link
					key={tab.value}
					href={tab.href}
					className={clsx(styles.tab, activeStyle)}
					data-tab={tab.value}
				>
					<Button iconLeft={tab.icon}>{tab.name ? tab.name : undefined}</Button>
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

		if (isSignedIn)
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
					onClick: () =>
						signOut({
							callbackUrl: "/"
						})
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
	}, [isAdmin, resolvedTheme, isSignedIn, setTheme])

	// // TODO: this should not be necessary.
	// if (!clientHydrated) {
	// 	return (
	// 		<header>
	// 			<div className={styles.tabs}>{getPages(true).map(getButton)}</div>
	// 		</header>
	// 	)
	// }

	const buttons = pages.map(getButton)

	return (
		<header className={clsx(styles.header, {
			[styles.loading]: isLoading,
		})}>
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
