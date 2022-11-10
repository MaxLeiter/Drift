import { Tooltip, Button, Spacer } from "@geist-ui/core/dist"
import ChevronUp from "@geist-ui/icons/chevronUpCircleFill"
import { useEffect, useState } from "react"
import styles from "./scroll.module.css"

const ScrollToTop = () => {
	const [shouldShow, setShouldShow] = useState(false)
	useEffect(() => {
		// if user is scrolled, set visible
		const handleScroll = () => {
			setShouldShow(window.scrollY > 100)
		}
		window.addEventListener("scroll", handleScroll)
		return () => window.removeEventListener("scroll", handleScroll)
	}, [])

	const isReducedMotion =
		typeof window !== "undefined"
			? window.matchMedia("(prefers-reduced-motion: reduce)").matches
			: false
	const onClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.currentTarget.blur()

		window.scrollTo({ top: 0, behavior: isReducedMotion ? "auto" : "smooth" })
	}

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "row",
				width: "100%",
				height: 24,
				justifyContent: "flex-end"
			}}
		>
			<Tooltip
				hideArrow
				text="Scroll to Top"
				className={`${styles["scroll-up"]} ${
					shouldShow ? styles["scroll-up-shown"] : ""
				}`}
			>
				<Button
					aria-label="Scroll to Top"
					onClick={onClick}
					style={{ background: "var(--light-gray)" }}
					auto
				>
					<Spacer height={2 / 3} inline width={0} />
					<ChevronUp />
				</Button>
			</Tooltip>
		</div>
	)
}

export default ScrollToTop
