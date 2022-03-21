import React from 'react'
import MoonIcon from '@geist-ui/icons/moon'
import SunIcon from '@geist-ui/icons/sun'
import { Select } from '@geist-ui/core'
// import { useAllThemes, useTheme } from '@geist-ui/core'
import styles from './header.module.css'
import { ThemeProps } from '@lib/types'

const Controls = ({ changeTheme, theme }: ThemeProps) => {
    const switchThemes = (type: string | string[]) => {
        changeTheme()
        if (typeof window === 'undefined' || !window.localStorage) return
        window.localStorage.setItem('drift-theme', Array.isArray(type) ? type[0] : type)
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
        </div >
    )
}

export default React.memo(Controls);
