"use client"

import { useSelectedLayoutSegments } from "next/navigation"
import FadeIn from "@components/fade-in"
import {
	Circle,
	Home,
	Moon,
	PlusCircle,
	Settings,
	Sun,
	User,
	UserX
} from "react-feather"
import { signOut } from "next-auth/react"
import { Button } from "@components/button"
import Link from "@components/link"
import { useSessionSWR } from "@lib/use-session-swr"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { cn } from "@lib/cn"

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

function NavButton({ className, ...tab }: Tab & { className?: string }) {
	const segment = useSelectedLayoutSegments().slice(-1)[0]
	const isActive = segment === tab.value.toLowerCase()
	const activeStyle = isActive ? "text-primary-500" : "text-gray-600"
	if (tab.onClick) {
		return (
			<Button
				key={tab.value}
				onClick={tab.onClick}
				className={cn(activeStyle, "w-full md:w-auto", className)}
				aria-label={tab.name}
				aria-current={isActive ? "page" : undefined}
				data-tab={tab.value}
				variant={"ghost"}
			>
				{tab.name ? tab.name : undefined}
			</Button>
		)
	} else {
		return (
			<Link
				key={tab.value}
				href={tab.href}
				data-tab={tab.value}
				className="w-full"
			>
				<Button
					className={cn(activeStyle, "w-full md:w-auto", className)}
					aria-label={tab.name}
					variant={"ghost"}
				>
					{tab.name ? tab.name : undefined}
				</Button>
			</Link>
		)
	}
}

function ThemeButton() {
	const { setTheme, resolvedTheme } = useTheme()
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	return (
		<>
			{!mounted && (
				<NavButton
					name="Theme"
					icon={<Circle opacity={0.3} />}
					value="dark"
					href=""
					key="theme"
				/>
			)}
			{mounted && (
				<NavButton
					name="Theme"
					icon={
						<FadeIn>{resolvedTheme === "dark" ? <Sun /> : <Moon />}</FadeIn>
					}
					value="dark"
					onClick={() => {
						setTheme(resolvedTheme === "dark" ? "light" : "dark")
					}}
					key="theme"
				/>
			)}
		</>
	)
}

export function HeaderButtons(): JSX.Element {
	const { isAdmin, isAuthenticated, userId } = useSessionSWR()

	useEffect(() => {
		if (isAuthenticated && !userId) {
			signOut()
		}
	}, [isAuthenticated, userId])

	return (
		<>
			<NavButton
				key="home"
				name="Home"
				icon={<Home />}
				value="home"
				href="/home"
			/>
			<NavButton
				key="new"
				name="New"
				icon={<PlusCircle />}
				value="new"
				href="/new"
			/>
			<NavButton
				key="yours"
				name="Yours"
				icon={<User />}
				value="mine"
				href="/mine"
			/>
			<NavButton
				name="Settings"
				icon={<Settings />}
				value="settings"
				href="/settings"
				key="settings"
			/>
			<ThemeButton key="theme-button" />
			{isAdmin && (
				<NavButton
					name="Admin"
					key="admin"
					icon={<Settings />}
					value="admin"
					href="/admin"
					className="transition-opacity duration-500"
				/>
			)}
			{isAuthenticated === true && (
				<NavButton
					name="Sign Out"
					key="signout"
					icon={<UserX />}
					value="signout"
					onClick={() => {
						signOut({
							callbackUrl: `/signedout${userId ? "?userId=" + userId : ""}`
						})
					}}
					width={SIGN_IN_WIDTH}
				/>
			)}
			{isAuthenticated === false && (
				<NavButton
					name="Sign In"
					key="signin"
					icon={<User />}
					value="signin"
					href="/signin"
					width={SIGN_IN_WIDTH}
				/>
			)}
			{isAuthenticated === undefined && (
				<NavButton
					name="Sign"
					key="signin"
					icon={<User />}
					value="signin"
					href="/signin"
					width={SIGN_IN_WIDTH}
				/>
			)}
		</>
	)
}
