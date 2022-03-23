
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
import SunIcon from '@geist-ui/icons/sun';
import type { ThemeProps } from "@lib/types";
import useTheme from "@lib/hooks/use-theme";
import { Button } from "@geist-ui/core";

type Tab = {
    name: string
    icon: JSX.Element
    condition?: boolean
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
    const { signedIn: isSignedIn } = useSignedIn()
    const [pages, setPages] = useState<Tab[]>([])
    const { changeTheme, theme } = useTheme()
    useEffect(() => {
        setBodyHidden(expanded)
    }, [expanded, setBodyHidden])

    useEffect(() => {
        if (!isMobile) {
            setExpanded(false)
        }
    }, [isMobile])

    useEffect(() => {
        const pageList: Tab[] = [
            {
                name: "Home",
                href: "/",
                icon: <HomeIcon />,
                condition: !isSignedIn,
                value: "home"
            },
            {
                name: "New",
                href: "/new",
                icon: <NewIcon />,
                condition: isSignedIn,
                value: "new"
            },
            {
                name: "Yours",
                href: "/mine",
                icon: <YourIcon />,
                condition: isSignedIn,
                value: "mine"
            },
            {
                name: "Sign out",
                href: "/signout",
                icon: <SignOutIcon />,
                condition: isSignedIn,
                value: "signout"
            },
            {
                name: "Sign in",
                href: "/signin",
                icon: <SignInIcon />,
                condition: !isSignedIn,
                value: "signin"
            },
            {
                name: "Sign up",
                href: "/signup",
                icon: <SignUpIcon />,
                condition: !isSignedIn,
                value: "signup"
            },
            {
                name: isMobile ? "GitHub" : "",
                href: "https://github.com/maxleiter/drift",
                icon: <GitHubIcon />,
                condition: true,
                value: "github"
            },
            {
                name: isMobile ? "Change theme" : "",
                onClick: function () {
                    if (typeof window !== 'undefined') {
                        changeTheme();
                    }
                },
                icon: theme === 'light' ? <MoonIcon /> : <SunIcon />,
                condition: true,
                value: "theme",
            }
        ]

        setPages(pageList.filter(page => page.condition))
    }, [changeTheme, isMobile, isSignedIn, theme])


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
        <Page.Header height={'var(--page-nav-height)'} margin={0} paddingBottom={0} paddingTop={"var(--gap)"}>
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
