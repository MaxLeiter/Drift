import React, { useEffect, useState } from "react"
import MoonIcon from "@geist-ui/icons/moon"
import SunIcon from "@geist-ui/icons/sun"
import styles from "./header.module.css"
import { Select } from "@geist-ui/core/dist"
import { useTheme } from "@components/theme/ThemeClientContextProvider"

const Controls = () => {
	const { theme, setTheme } = useTheme()
	const switchThemes = () => {
		if (theme === "dark") {
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
				value={theme}
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
