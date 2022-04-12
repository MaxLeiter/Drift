import React, { useEffect, useState } from "react"
import MoonIcon from "@geist-ui/icons/moon"
import SunIcon from "@geist-ui/icons/sun"
// import { useAllThemes, useTheme } from '@geist-ui/core'
import styles from "./header.module.css"
import { Select } from "@geist-ui/core"
import { useTheme } from "next-themes"

const Controls = () => {
	const [mounted, setMounted] = useState(false)
	const { resolvedTheme, setTheme } = useTheme()
	useEffect(() => setMounted(true), [])
	if (!mounted) return null
	const switchThemes = () => {
		if (resolvedTheme === "dark") {
			setTheme("light")
		} else {
			setTheme("dark")
		}
	}

	return (
		<div className={styles.wrapper}>
			<Select
				scale={0.5}
				h="28px"
				pure
				onChange={switchThemes}
				value={resolvedTheme}
			>
				<Select.Option value="light">
					<span className={styles.selectContent}>
						<SunIcon size={14} /> Light
					</span>
				</Select.Option>
				<Select.Option value="dark">
					<span className={styles.selectContent}>
						<MoonIcon size={14} /> Dark
					</span>
				</Select.Option>
			</Select>
		</div>
	)
}

export default React.memo(Controls)
