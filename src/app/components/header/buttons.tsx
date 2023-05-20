"use client"

import { useSelectedLayoutSegments } from "next/navigation"
import FadeIn from "@components/fade-in"
import { setDriftTheme } from "src/app/lib/set-theme"
import {
	Home,
	Moon,
	PlusCircle,
	Settings,
	Sun,
	User,
	UserX
} from "react-feather"
import { signOut } from "next-auth/react"
import Button from "@components/button"
import Link from "@components/link"
import { useSessionSWR } from "@lib/use-session-swr"
import { useTheme } from "next-themes"
import styles from "./buttons.module.css"

// constant width for sign in / sign out buttons to avoid CLS
const SIGN_IN_WIDTH = 110

type Tab = {
	name: string
	icon: JSX.Element
	value: string
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

export function HeaderButtons({
	isAuthenticated,
	theme: initialTheme
}: {
	isAuthenticated: boolean
	theme: string
}) {
	const { isAdmin, userId } = useSessionSWR()
	const { resolvedTheme } = useTheme();
	return <>
		{getButtons({
			isAuthenticated,
			theme: resolvedTheme ? resolvedTheme : initialTheme,
			isAdmin,
			userId
		})}
	</>
}

function NavButton(tab: Tab) {
	const segment = useSelectedLayoutSegments().slice(-1)[0]
	const isActive = segment === tab.value.toLowerCase()
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
				<Button className={activeStyle} iconLeft={tab.icon} width={tab.width}>
					{tab.name ? tab.name : undefined}
				</Button>
			</Link>
		)
	}
}

function ThemeButton({ theme }: { theme: string }) {
	const { setTheme } = useTheme()
	return (
		<NavButton
			name="Theme"
			icon={theme === "dark" ? <Sun /> : <Moon />}
			value="dark"
			onClick={() => {
				setDriftTheme(theme === "dark" ? "light" : "dark", setTheme)
			}}
			key="theme"
		/>
	)
}

/** For use by mobile */
export function getButtons({
	isAuthenticated,
	theme,
	// mutate: mutateSession,
	isAdmin,
	userId
}: {
	isAuthenticated: boolean
	theme: string
	// mutate: KeyedMutator<Session>
	isAdmin?: boolean,
	userId?: string
}) {
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
			value="mine"
			href="/mine"
		/>,
		<NavButton
			name="Settings"
			icon={<Settings />}
			value="settings"
			href="/settings"
			key="settings"
		/>,
		<ThemeButton key="theme-button" theme={theme} />,
		isAdmin ? (
			<FadeIn>
				<NavButton
					name="Admin"
					key="admin"
					icon={<Settings />}
					value="admin"
					href="/admin"
				/>
			</FadeIn>
		) : undefined,
		isAuthenticated === true ? (
			<NavButton
				name="Sign Out"
				key="signout"
				icon={<UserX />}
				value="signout"
				onClick={() => {
					signOut({
						callbackUrl: `/signedout${
							userId ? "?userId=" + userId : ""
						}`
					})
				}}
				width={SIGN_IN_WIDTH}
			/>
		) : undefined,
		isAuthenticated === false ? (
			<NavButton
				name="Sign In"
				key="signin"
				icon={<User />}
				value="signin"
				href="/signin"
				width={SIGN_IN_WIDTH}
			/>
		) : undefined
	].filter(Boolean)
}
