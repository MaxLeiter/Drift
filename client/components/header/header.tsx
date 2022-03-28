
import { ButtonGroup, Page, Spacer, Tabs, useBodyScroll, useMediaQuery, } from "@geist-ui/core";

import { useCallback, useEffect, useState } from "react";
import styles from './header.module.css';
import { useRouter } from "next/router";
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
import { Button } from "@geist-ui/core";
import useUserData from "@lib/hooks/use-user-data";

type Tab = {
    name: string
    icon: JSX.Element
    value: string
    onClick?: () => void
    href?: string
}


const Header = () => {
    const router = useRouter();
    const [selectedTab, setSelectedTab] = useState<string>(router.pathname === '/' ? 'home' : router.pathname.split('/')[1]);
    const [expanded, setExpanded] = useState<boolean>(false)
    const [, setBodyHidden] = useBodyScroll(null, { scrollLayer: true })
    const isMobile = useMediaQuery('xs', { match: 'down' })
    const { signedIn: isSignedIn, signout } = useSignedIn()
    const userData = useUserData();
    const [pages, setPages] = useState<Tab[]>([])
    const { setTheme, theme } = useTheme()
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
                        setTheme(theme === 'light' ? 'dark' : 'light');
                },
                icon: theme === 'light' ? <MoonIcon /> : <SunIcon />,
                value: "theme",
            }
        ]

        if (isSignedIn)
            setPages([
                {
                    name: 'new',
                    icon: <NewIcon />,
                    value: 'new',
                    href: '/'
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
                    onClick: signout
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
    }, [isMobile, isSignedIn, theme, userData])

    const onTabChange = useCallback((tab: string) => {
        if (typeof window === 'undefined') return
        const match = pages.find(page => page.value === tab)
        if (match?.onClick) {
            match.onClick()
        } else {
            router.push(match?.href || '/')
        }
    }, [pages, router])


    return (
        <Page.Header height={'var(--page-nav-height)'} marginBottom={2}>
            <div className={styles.tabs}>
                <Tabs
                    value={selectedTab}
                    leftSpace={0}
                    align="center"
                    hideDivider
                    hideBorder
                    onChange={onTabChange}>
                    {pages.map((tab) => {
                        return <Tabs.Item
                            font="14px"
                            label={<>{tab.icon} {tab.name}</>}
                            value={tab.value}
                            key={`${tab.value}`}
                        />
                    })}
                </Tabs>
            </div>
            <div className={styles.controls}>
                <Button
                    auto
                    type="abort"
                    onClick={() => setExpanded(!expanded)}
                    aria-label="Menu"
                >
                    <Spacer height={5 / 6} width={0} />
                    <MenuIcon />
                </Button>
            </div>
            {isMobile && expanded && (<div className={styles.mobile}>
                <ButtonGroup vertical>
                    {pages.map((tab, index) => {
                        return <Button
                            key={`${tab.name}-${index}`}
                            onClick={() => onTabChange(tab.value)}
                            icon={tab.icon}
                        >
                            {tab.name}
                        </Button>
                    })}
                </ButtonGroup>
            </div>)}
        </Page.Header >
    )
}

export default Header
