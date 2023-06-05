"use client"

import { Stack } from "@components/stack"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@lib/cn"
import { DropdownMenu } from "@components/dropdown-menu"
import {
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from "@radix-ui/react-dropdown-menu"
import { ArrowDownCircle } from "react-feather"

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
	return (
		<header className="container mx-auto flex items-center justify-between px-4 py-4">
			<div className="flex items-center">
				<Image
					src={"/assets/logo.svg"}
					width={48}
					height={48}
					alt=""
					priority
				/>
				<span className="text-lg ml-2">Drift</span>
			</div>
			<nav className="flex items-center justify-center">
				<ul className="flex space-x-4">
					<Link
						href="/home"
						className="text-sm font-medium transition-colors hover:text-primary"
					>
						Home
					</Link>
					<Link
						href="/new"
						className="text-sm font-medium transition-colors hover:text-primary"
					>
						New
					</Link>
					<Link
						href="/mine"
						className="text-sm font-medium transition-colors hover:text-primary"
					>
						Yours
					</Link>
					<Link
						href="/settings"
						className="text-sm font-medium transition-colors hover:text-primary"
					>
						Settings
					</Link>
				</ul>
			</nav>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<ArrowDownCircle />
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem>
						<Link href="/signin">Sign In</Link>
					</DropdownMenuItem>
					<DropdownMenuItem>Change Theme</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</header>
	)
}
