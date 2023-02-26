"use client"
import styles from "./header.module.css"

// import useUserData from "@lib/hooks/use-user-data"
import Link from "@components/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import Button from "@components/button"
import { useTheme } from "next-themes"
import {
	Home,
	Loader,
	Moon,
	PlusCircle,
	Settings,
	Sun,
	User,
	UserX
} from "react-feather"
import { ReactNode, useEffect, useMemo, useState } from "react"
import { useSessionSWR } from "@lib/use-session-swr"
import FadeIn from "@components/fade-in"
import MobileHeader from "./mobile"

// constant width for sign in / sign out buttons to avoid CLS
const SIGN_IN_WIDTH = 110

type Tab = {
	name: string
	icon: ReactNode
	value: string
	// onClick?: () => void
	// href?: string
	width?: number
} & (
	| {
			onClick: () => void
			href?: undefined
	  }
	| {
			onClick?: undefined
			href: string
	  }
)

const Header = () => {
	const {
		isAdmin,
		isAuthenticated,
		isLoading: isAuthLoading,
		mutate: mutateSession
	} = useSessionSWR()

	const pathname = usePathname()
	const { setTheme, resolvedTheme } = useTheme()
	const [mounted, setMounted] = useState(false)

	useEffect(() => setMounted(true), [])

	// const buttons = pages.map(NavButton)

	const buttons = useMemo(() => {
		const NavButton = (tab: Tab) => {
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
						width={tab.width}
					>
						{tab.name ? tab.name : undefined}
					</Button>
				)
			} else {
				return (
					<Link key={tab.value} href={tab.href} data-tab={tab.value}>
						<Button
							className={activeStyle}
							iconLeft={tab.icon}
							width={tab.width}
						>
							{tab.name ? tab.name : undefined}
						</Button>
					</Link>
				)
			}
		}

		const NavButtonPlaceholder = ({ width }: { width: number }) => {
			return (
				<Button
					key="placeholder"
					iconLeft={<></>}
					aria-current={undefined}
					aria-hidden
					style={{ color: "transparent" }}
					width={width}
				/>
			)
		}

		const getThemeIcon = () => {
			if (!mounted) {
				return <Loader />
			}

			return <FadeIn>{resolvedTheme === "light" ? <Moon /> : <Sun />}</FadeIn>
		}

		return [
			<NavButton
				key="home"
				name="Home"
				icon={<Home />}
				value="home"
				href="/home"
			/>,
			<NavButton
				key="new"
				name="New"
				icon={<PlusCircle />}
				value="new"
				href="/new"
			/>,
			<NavButton
				key="yours"
				name="Yours"
				icon={<User />}
				value="yours"
				href="/mine"
			/>,
			<NavButton
				name="Settings"
				icon={<Settings />}
				value="settings"
				href="/settings"
				key="settings"
			/>,
			<NavButton
				name="Theme"
				icon={getThemeIcon()}
				value="dark"
				onClick={() => {
					setTheme(resolvedTheme === "light" ? "dark" : "light")
				}}
				key="theme"
			/>,
			isAuthLoading ? (
				<NavButtonPlaceholder width={SIGN_IN_WIDTH} key="signin" />
			) : undefined,
			!isAuthLoading ? (
				isAuthenticated ? (
					<FadeIn key="signout-fade">
						<NavButton
							name="Sign Out"
							icon={<UserX />}
							value="signout"
							onClick={() => {
								signOut()
								mutateSession(undefined)
							}}
							width={SIGN_IN_WIDTH}
						/>
					</FadeIn>
				) : (
					<FadeIn key="signin-fade">
						<NavButton
							name="Sign In"
							icon={<User />}
							value="signin"
							href="/signin"
							width={SIGN_IN_WIDTH}
						/>
					</FadeIn>
				)
			) : undefined,
			isAdmin ? (
				<FadeIn>
					<NavButton
						name="Admin"
						icon={<Settings />}
						value="admin"
						href="/admin"
					/>
				</FadeIn>
			) : undefined
		].filter(Boolean)
	}, [
		isAuthLoading,
		isAuthenticated,
		isAdmin,
		pathname,
		mounted,
		resolvedTheme,
		setTheme,
		mutateSession
	])

	return (
		<header className={styles.header}>
			<div className={styles.tabs}>
				<div className={styles.buttons}>{buttons}</div>
			</div>
			<MobileHeader buttons={buttons} />
		</header>
	)
}

export default Header
