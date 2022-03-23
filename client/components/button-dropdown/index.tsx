import Button from "@components/button"
import React, { useCallback, useEffect } from "react"
import { useState } from "react"
import styles from './dropdown.module.css'
import DownIcon from '@geist-ui/icons/arrowDown'
type Props = {
    type?: "primary" | "secondary"
    loading?: boolean
    disabled?: boolean
    className?: string
    iconHeight?: number
}

type Attrs = Omit<React.HTMLAttributes<any>, keyof Props>
type ButtonDropdownProps = Props & Attrs

const ButtonDropdown: React.FC<React.PropsWithChildren<ButtonDropdownProps>> = ({
    type,
    className,
    disabled,
    loading,
    iconHeight = 24,
    ...props
}) => {
    const [visible, setVisible] = useState(false)
    const [dropdown, setDropdown] = useState<HTMLDivElement | null>(null)

    const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation()
        setVisible(!visible)
    }

    const onBlur = () => {
        setVisible(false)
    }

    const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation()
    }

    const onMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation()
    }

    const onMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation()
        setVisible(false)
    }

    const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Escape") {
            setVisible(false)
        }
    }

    const onClickOutside = useCallback(() => (e: React.MouseEvent<HTMLDivElement>) => {
        if (dropdown && !dropdown.contains(e.target as Node)) {
            setVisible(false)
        }
    }, [dropdown])

    useEffect(() => {
        if (visible) {
            document.addEventListener("mousedown", onClickOutside)
        } else {
            document.removeEventListener("mousedown", onClickOutside)
        }

        return () => {
            document.removeEventListener("mousedown", onClickOutside)
        }
    }, [visible, onClickOutside])

    if (!Array.isArray(props.children)) {
        return null
    }

    return (
        <div
            className={`${styles.main} ${className}`}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
            onKeyDown={onKeyDown}
            onBlur={onBlur}
        >
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                {props.children[0]}
                <Button style={{ height: iconHeight, width: iconHeight }} className={styles.icon} onClick={() => setVisible(!visible)}><DownIcon /></Button>
            </div>
            {
                visible && (
                    <div
                        className={`${styles.dropdown}`}
                    >
                        <div
                            className={`${styles.dropdownContent}`}
                        >
                            {props.children.slice(1)}

                        </div>
                    </div>
                )
            }
        </div >
    )



}

export default ButtonDropdown