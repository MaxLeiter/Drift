"use client"

import Button from "@components/button"
import Tooltip from "@components/tooltip"
import { useEffect, useState } from "react"
import { ChevronUp } from "react-feather"
import styles from "./scroll.module.css"

const ScrollToTop = () => {
	const [shouldShow, setShouldShow] = useState(false)

	const isReducedMotion =
		typeof window !== "undefined"
			? window.matchMedia("(prefers-reduced-motion: reduce)").matches
			: false

	useEffect(() => {
		// if user is scrolled, set visible
		const handleScroll = () => {
			setShouldShow(window.scrollY > 100)
		}
		window.addEventListener("scroll", handleScroll)
		return () => window.removeEventListener("scroll", handleScroll)
	}, [])

	const onClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.currentTarget.blur()
		window.scrollTo({ top: 0, behavior: isReducedMotion ? "auto" : "smooth" })
	}

	return (
		<div className={styles.root}>
			<Tooltip
				content="Scroll to Top"
				className={`${styles["scroll-up"]} ${
					shouldShow ? styles["scroll-up-shown"] : ""
				}`}
			>
				<Button
					aria-label="Scroll to Top"
					onClick={onClick}
					iconLeft={<ChevronUp />}
				/>
			</Tooltip>
		</div>
	)
}

export default ScrollToTop
