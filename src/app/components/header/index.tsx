"use client"

import Link from "next/link"
import { cn } from "@lib/cn"

import { useSessionSWR } from "@lib/use-session-swr"
import { PropsWithChildren, useEffect, useState } from "react"
import { useSelectedLayoutSegments } from "next/navigation"
import Image from "next/image"
import { useTheme } from "next-themes"
import { Moon, Sun } from "react-feather"
import FadeIn from "@components/fade-in"
import MobileHeader from "./mobile"

export default function Header() {
	const { isAdmin, isAuthenticated } = useSessionSWR()
	const { resolvedTheme, setTheme } = useTheme()
	const [isMounted, setIsMounted] = useState(false)
	const toggleTheme = () => {
		setTheme(resolvedTheme === "dark" ? "light" : "dark")
	}

	useEffect(() => {
		setIsMounted(true)
	}, [])

	return (
		<header className="flex items-center justify-start h-16 mt-4 md:justify-between">
			<span className="items-center hidden md:flex">
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
							</>
						)}
					</ul>
				</nav>
			</span>
			<span className="flex items-center justify-center md:hidden">
				<MobileHeader />
			</span>
			{isMounted && (
				<FadeIn>
					<button
						aria-hidden
						className="flex items-center justify-center w-8 h-8 ml-4 font-medium transition-colors cursor-pointer text-muted-foreground hover:text-primary md:ml-0"
						onClick={toggleTheme}
						title="Toggle theme"
					>
						{resolvedTheme === "dark" ? (
							<Sun className="h-[16px] w-[16px]" />
						) : (
							<Moon className="h-[16px] w-[16px]" />
						)}
					</button>
				</FadeIn>
			)}
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
	const disabledClasses = "text-gray-600 hover:text-gray-400 cursor-not-allowed"

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
