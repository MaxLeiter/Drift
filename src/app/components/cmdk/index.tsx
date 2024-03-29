"use client"

import { CommandDialog, CommandList, CommandInput, CommandEmpty } from "./cmdk"
import { useEffect, useRef, useState } from "react"
import "./dialog.css"
import HomePage from "./pages/home"
import PostsPage from "./pages/posts"

export type CmdKPage = "home" | "posts"
export default function CmdK() {
	const [open, setOpen] = useState(false)
	const ref = useRef<HTMLDivElement>()
	const [page, setPage] = useState<CmdKPage>("home")

	// Toggle the menu when ⌘K is pressed
	useEffect(() => {
		const openCloseListener = (e: KeyboardEvent) => {
			if (e.key === "k" && e.metaKey) {
				e.preventDefault()
				setOpen((open) => !open)
			} else if (e.key === "Escape") {
				e.preventDefault()
				if (page !== "home") {
					setPage("home")
					// TODO: this shouldn't be necessary?
					setOpen(true)
				} else {
					setOpen(false)
				}
			}
		}

		document.addEventListener("keydown", openCloseListener)
		return () => {
			document.removeEventListener("keydown", openCloseListener)
		}
	}, [page])

	function bounce() {
		if (ref.current) {
			ref.current.style.transform = "translate(-50%, -50%) scale(0.96)"
			setTimeout(() => {
				if (ref.current) {
					ref.current.style.transform = ""
				}
			}, 100)
		}
	}
	// bounce on page change
	useEffect(() => {
		bounce()
	}, [page])

	return (
		<CommandDialog open={open} onOpenChange={setOpen}>
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>
				{page === "home" ? (
					<HomePage setPage={setPage} setOpen={setOpen} />
				) : null}
				{page === "posts" ? <PostsPage setOpen={setOpen} /> : null}
			</CommandList>
			<CommandInput />
		</CommandDialog>
	)
}
