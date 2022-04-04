
import { ButtonGroup, Button, Page, Spacer, useBodyScroll, useMediaQuery, } from "@geist-ui/core";

import { useCallback, useEffect, useMemo, useState } from "react";
import styles from './header.module.css';
import useSignedIn from "../../lib/hooks/use-signed-in";

import HomeIcon from '@geist-ui/icons/home';
import MenuIcon from '@geist-ui/icons/menu';
import GitHubIcon from '@geist-ui/icons/github';
import SignOutIcon from '@geist-ui/icons/userX';
import SignInIcon from '@geist-ui/icons/user';
import SignUpIcon from '@geist-ui/icons/userPlus';
import NewIcon from '@geist-ui/icons/plusCircle';
import YourIcon from '@geist-ui/icons/list'
import MoonIcon from '@geist-ui/icons/moon';
import SettingsIcon from '@geist-ui/icons/settings';
import SunIcon from '@geist-ui/icons/sun';
import { useTheme } from "next-themes"
import useUserData from "@lib/hooks/use-user-data";
import Link from "next/link";
import { useRouter } from "next/router";

type Tab = {
    name: string
    icon: JSX.Element
    value: string
    onClick?: () => void
    href?: string
}


const Header = () => {
    const router = useRouter()
    const [expanded, setExpanded] = useState<boolean>(false)
    const [, setBodyHidden] = useBodyScroll(null, { scrollLayer: true })
    const isMobile = useMediaQuery('xs', { match: 'down' })
    const { signedIn: isSignedIn } = useSignedIn()
    const userData = useUserData();
    const [pages, setPages] = useState<Tab[]>([])
    const { setTheme, resolvedTheme } = useTheme()

    useEffect(() => {
        setBodyHidden(expanded)
    }, [expanded, setBodyHidden])

    useEffect(() => {
        if (!isMobile) {
            setExpanded(false)
        }
    }, [isMobile])

    useEffect(() => {
        const defaultPages: Tab[] = [
            {
                name: isMobile ? "GitHub" : "",
                href: "https://github.com/maxleiter/drift",
                icon: <GitHubIcon />,
                value: "github"
            },
            {
                name: isMobile ? "Change theme" : "",
                onClick: function () {
                    if (typeof window !== 'undefined')
                        setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
                },
                icon: resolvedTheme === 'light' ? <MoonIcon /> : <SunIcon />,
                value: "theme",
            }
        ]

        if (isSignedIn)
            setPages([
                {
                    name: 'new',
                    icon: <NewIcon />,
                    value: 'new',
                    href: '/new'
                },
                {
                    name: 'yours',
                    icon: <YourIcon />,
                    value: 'yours',
                    href: '/mine'
                },
                // {
                //     name: 'settings',
                //     icon: <SettingsIcon />,
                //     value: 'settings',
                //     href: '/settings'
                // },
                {
                    name: 'sign out',
                    icon: <SignOutIcon />,
                    value: 'signout',
                    href: '/signout'
                },
                ...defaultPages
            ])
        else
            setPages([
                {
                    name: 'home',
                    icon: <HomeIcon />,
                    value: 'home',
                    href: '/'
                },
                {
                    name: 'Sign in',
                    icon: <SignInIcon />,
                    value: 'signin',
                    href: '/signin'
                },
                {
                    name: 'Sign up',
                    icon: <SignUpIcon />,
                    value: 'signup',
                    href: '/signup'
                },
                ...defaultPages
            ])
        if (userData?.role === "admin") {
            setPages((pages) => [
                ...pages,
                {
                    name: 'admin',
                    icon: <SettingsIcon />,
                    value: 'admin',
                    href: '/admin'
                }
            ])
        }
        // TODO: investigate deps causing infinite loop 
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMobile, isSignedIn, resolvedTheme, userData])

    const onTabChange = useCallback((tab: string) => {
        if (typeof window === 'undefined') return
        const match = pages.find(page => page.value === tab)
        if (match?.onClick) {
            match.onClick()
        }
    }, [pages])

    const getButton = useCallback((tab: Tab) => {
        const activeStyle = router.pathname === tab.href ? styles.active : ""
        if (tab.onClick) {
            return <Button
                auto={isMobile ? false : true}
                key={tab.value}
                icon={tab.icon}
                onClick={() => onTabChange(tab.value)}
                className={`${styles.tab} ${activeStyle}`}
                shadow={false}
            >
                {tab.name ? tab.name : undefined}
            </Button>
        } else if (tab.href) {
            return <Link key={tab.value} href={tab.href}>
                <a className={styles.tab}>
                    <Button
                        className={activeStyle}
                        auto={isMobile ? false : true}
                        icon={tab.icon}
                        shadow={false}
                    >
                        {tab.name ? tab.name : undefined}
                    </Button>
                </a>
            </Link>
        }
    }, [isMobile, onTabChange, router.pathname])

    const buttons = useMemo(() => pages.map(getButton), [pages, getButton])

    return (
        <Page.Header>
            <div className={styles.tabs}>
                <div className={styles.buttons}>
                    {buttons}
                </div>
            </div>
            <div className={styles.controls}>
                <Button
                    effect={false}
                    auto
                    type="abort"
                    onClick={() => setExpanded(!expanded)}
                    aria-label="Menu"
                >
                    <Spacer height={5 / 6} width={0} />
                    <MenuIcon />
                </Button>
            </div>
            {/* setExpanded should occur elsewhere; we don't want to close if they change themes */}
            {isMobile && expanded && (<div className={styles.mobile} onClick={() => setExpanded(!expanded)}>
                <ButtonGroup vertical style={{
                    background: "var(--bg)",
                }}>
                    {buttons}
                </ButtonGroup>
            </div>)}
        </Page.Header >
    )
}

export default Header
