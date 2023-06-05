"use client"

import Link from "next/link"
import { cn } from "@lib/cn"

import { useSessionSWR } from "@lib/use-session-swr"
import { PropsWithChildren, useEffect, useState } from "react"
import { useSelectedLayoutSegments } from "next/navigation"
import Image from "next/image"
import FadeIn from "@components/fade-in"
import { useTheme } from "next-themes"

// <NavButton
// 				key="home"
// 				name="Home"
// 				icon={<Home />}
// 				value="home"
// 				href="/home"
// 			/>
// 			<NavButton
// 				key="new"
// 				name="New"
// 				icon={<PlusCircle />}
// 				value="new"
// 				href="/new"
// 			/>
// 			<NavButton
// 				key="yours"
// 				name="Yours"
// 				icon={<User />}
// 				value="mine"
// 				href="/mine"
// 			/>
// 			<NavButton
// 				name="Settings"
// 				icon={<Settings />}
// 				value="settings"
// 				href="/settings"
// 				key="settings"
// 			/>
// 			<ThemeButton key="theme-button" />
// 			{isAdmin && (
// 				<FadeIn>
// 					<NavButton
// 						name="Admin"
// 						key="admin"
// 						icon={<Settings />}
// 						value="admin"
// 						href="/admin"
// 					/>
// 				</FadeIn>
// 			)}
// 			{isAuthenticated === true && (
// 				<NavButton
// 					name="Sign Out"
// 					key="signout"
// 					icon={<UserX />}
// 					value="signout"
// 					onClick={() => {
// 						signOut({
// 							callbackUrl: `/signedout${userId ? "?userId=" + userId : ""}`
// 						})
// 					}}
// 					width={SIGN_IN_WIDTH}
// 				/>
// 			)}
// 			{isAuthenticated === false && (
// 				<NavButton
// 					name="Sign In"
// 					key="signin"
// 					icon={<User />}
// 					value="signin"
// 					href="/signin"
// 					width={SIGN_IN_WIDTH}
// 				/>
// 			)}
// 			{isAuthenticated === undefined && (
// 				<NavButton
// 					name="Sign"
// 					key="signin"
// 					icon={<User />}
// 					value="signin"
// 					href="/signin"
// 					width={SIGN_IN_WIDTH}
// 				/>

export default function Header() {
	const { isAdmin, isAuthenticated } = useSessionSWR()
	const { resolvedTheme, setTheme } = useTheme()
	const toggleTheme = () => {
		setTheme(resolvedTheme === "dark" ? "light" : "dark")
	}

	return (
		<header className="flex items-center h-16 mt-4">
			<Link href="/" className="flex items-center mr-4">
				<Image
					src={"/assets/logo.svg"}
					width={32}
					height={32}
					alt=""
					priority
				/>
				<span className="pl-4 text-lg font-bold bg-transparent">Drift</span>
			</Link>
			<nav className="flex space-x-4 lg:space-x-6">
				<ul className="flex justify-center space-x-4">
					<NavLink href="/home">Home</NavLink>
					<NavLink href="/new" disabled={!isAuthenticated}>
						New
					</NavLink>
					<NavLink href="/mine" disabled={!isAuthenticated}>
						Yours
					</NavLink>
					<NavLink href="/settings" disabled={!isAuthenticated}>
						Settings
					</NavLink>
					{isAdmin && <NavLink href="/admin">Admin</NavLink>}
					{isAuthenticated !== undefined && (
						<>
							{isAuthenticated === true && (
								<NavLink href="/signout">Sign Out</NavLink>
							)}
							{isAuthenticated === false && (
								<NavLink href="/signin">Sign In</NavLink>
							)}
							<span
								aria-hidden
								className="text-sm font-medium transition-colors cursor-pointer text-muted-foreground hover:text-primary"
								onClick={toggleTheme}
							>
								<FadeIn>{resolvedTheme === "dark" ? "Light" : "Dark"}</FadeIn>
							</span>
						</>
					)}
				</ul>
			</nav>
		</header>
	)
}

type NavLinkProps = PropsWithChildren<{
	href: string
	disabled?: boolean
	active?: boolean
}>

function NavLink({ href, disabled, children }: NavLinkProps) {
	const baseClasses =
		"text-sm text-muted-foreground font-medium transition-colors hover:text-primary"
	const activeClasses = "text-primary border-primary"
	const disabledClasses = "text-gray-400 hover:text-gray-400 cursor-default"

	const segments = useSelectedLayoutSegments()
	const activeSegment = segments[segments.length - 1]
	const isActive =
		activeSegment === href.slice(1) ||
		// special case / because it's an alias of /home/page.tsx
		(!activeSegment && href === "/home")

	return (
		<Link
			href={href}
			className={cn(
				baseClasses,
				isActive && activeClasses,
				disabled && disabledClasses
			)}
		>
			{children}
		</Link>
	)
}
