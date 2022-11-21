"use client"

import { Page, useBodyScroll, useMediaQuery } from "@geist-ui/core/dist"

import { useEffect, useState } from "react"
import styles from "./header.module.css"

import HomeIcon from "@geist-ui/icons/home"
import MenuIcon from "@geist-ui/icons/menu"
import GitHubIcon from "@geist-ui/icons/github"
import SignOutIcon from "@geist-ui/icons/userX"
import SignInIcon from "@geist-ui/icons/user"
import SignUpIcon from "@geist-ui/icons/userPlus"
import NewIcon from "@geist-ui/icons/plusCircle"
import YourIcon from "@geist-ui/icons/list"
import MoonIcon from "@geist-ui/icons/moon"
import SettingsIcon from "@geist-ui/icons/settings"
import SunIcon from "@geist-ui/icons/sun"
// import useUserData from "@lib/hooks/use-user-data"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { useTheme } from "@components/theme/ThemeClientContextProvider"
import Button from "@components/button"
import clsx from "clsx"

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
				icon: <GitHubIcon />,
				value: "github"
			},
			{
				name: isMobile ? "Change theme" : "",
				onClick: function () {
					if (typeof window !== "undefined")
						setTheme(theme === "light" ? "dark" : "light")
				},
				icon: theme === "light" ? <MoonIcon /> : <SunIcon />,
				value: "theme"
			}
		]

		if (isAdmin) {
			defaultPages.push({
				name: "Admin",
				icon: <SettingsIcon />,
				value: "admin",
				href: "/admin"
			})
		}

		if (signedIn)
			return [
				{
					name: "New",
					icon: <NewIcon />,
					value: "new",
					href: "/new"
				},
				{
					name: "Yours",
					icon: <YourIcon />,
					value: "yours",
					href: "/mine"
				},
				{
					name: "Settings",
					icon: <SettingsIcon />,
					value: "settings",
					href: "/settings"
				},
				{
					name: "Sign Out",
					icon: <SignOutIcon />,
					value: "signout",
					onClick: () => signOut({
						callbackUrl: "/",
					})
				},
				...defaultPages
			]
		else
			return [
				{
					name: "Home",
					icon: <HomeIcon />,
					value: "home",
					href: "/"
				},
				{
					name: "Sign in",
					icon: <SignInIcon />,
					value: "signin",
					href: "/signin"
				},
				{
					name: "Sign up",
					icon: <SignUpIcon />,
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
		<Page.Header>
			<div className={styles.tabs}>
				<div className={styles.buttons}>{buttons}</div>
			</div>
			<div className={styles.controls}>
				<Button onClick={() => setExpanded(!expanded)} aria-label="Menu">
					<MenuIcon />
				</Button>
			</div>
			{/* setExpanded should occur elsewhere; we don't want to close if they change themes */}
			{isMobile && expanded && (
				<div className={styles.mobile} onClick={() => setExpanded(!expanded)}>
					{buttons}
				</div>
			)}
		</Page.Header>
	)
}

export default Header
