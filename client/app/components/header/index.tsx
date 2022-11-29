"use client"
import { useBodyScroll, useMediaQuery } from "@geist-ui/core/dist"

import { useEffect, useState } from "react"
import styles from "./header.module.css"

// import useUserData from "@lib/hooks/use-user-data"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
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

type Tab = {
	name: string
	icon: JSX.Element
	value: string
	onClick?: () => void
	href?: string
}

const Header = ({ signedIn = false, isAdmin = false }) => {
	const pathname = usePathname()
	const [expanded, setExpanded] = useState<boolean>(false)
	const [, setBodyHidden] = useBodyScroll(null, { scrollLayer: true })
	const isMobile = useMediaQuery("xs", { match: "down" })
	// const { status } = useSession()
	// const signedIn = status === "authenticated"
	const { setTheme, theme } = useTheme()
	useEffect(() => {
		setBodyHidden(expanded)
	}, [expanded, setBodyHidden])

	useEffect(() => {
		if (!isMobile) {
			setExpanded(false)
		}
	}, [isMobile])

	const getPages = () => {
		const defaultPages: Tab[] = [
			{
				name: isMobile ? "GitHub" : "",
				href: "https://github.com/maxleiter/drift",
				icon: <GitHub />,
				value: "github"
			},
			{
				name: isMobile ? "Change theme" : "",
				onClick: function () {
					if (typeof window !== "undefined")
						setTheme(theme === "light" ? "dark" : "light")
				},
				icon: theme === "light" ? <Moon /> : <Sun />,
				value: "theme"
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

		if (signedIn)
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
				{
					name: "Sign Out",
					icon: <UserX />,
					value: "signout",
					onClick: () =>
						signOut({
							callbackUrl: "/"
						})
				},
				...defaultPages
			]
		else
			return [
				{
					name: "Home",
					icon: <Home />,
					value: "home",
					href: "/"
				},
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
				},
				...defaultPages
			]
	}

	const pages = getPages()

	const onTabChange = (tab: string) => {
		if (typeof window === "undefined") return
		const match = pages.find((page) => page.value === tab)
		if (match?.onClick) {
			match.onClick()
		}
	}

	const getButton = (tab: Tab) => {
		const isActive = pathname === tab.href
		const activeStyle = isActive ? styles.active : ""
		if (tab.onClick) {
			return (
				<Button
					key={tab.value}
					iconLeft={tab.icon}
					onClick={() => onTabChange(tab.value)}
					className={clsx(styles.tab, activeStyle)}
					aria-label={tab.name}
					aria-current={isActive ? "page" : undefined}
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
				>
					<Button iconLeft={tab.icon}>{tab.name ? tab.name : undefined}</Button>
				</Link>
			)
		}
	}

	const buttons = pages.map(getButton)

	return (
		<header>
			<div className={styles.tabs}>
				<div className={styles.buttons}>{buttons}</div>
			</div>
			<div className={styles.controls}>
				<Button onClick={() => setExpanded(!expanded)} aria-label="Menu">
					<Menu />
				</Button>
			</div>
			{/* setExpanded should occur elsewhere; we don't want to close if they change themes */}
			{isMobile && expanded && (
				<div className={styles.mobile} onClick={() => setExpanded(!expanded)}>
					{buttons}
				</div>
			)}
		</header>
	)
}

export default Header
