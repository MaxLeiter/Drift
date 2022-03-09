import { Page, ButtonGroup, Button, useBodyScroll, useMediaQuery, useTheme, Tabs, Loading, Spacer } from "@geist-ui/core";
import { Github as GitHubIcon, UserPlus as SignUpIcon, User as SignInIcon, Home as HomeIcon, Menu as MenuIcon, Tool as SettingsIcon, UserX as SignoutIcon, PlusCircle as NewIcon, List as YourIcon, Moon, Sun } from "@geist-ui/icons";
import { DriftProps } from "../../pages/_app";
import { useEffect, useMemo, useState } from "react";
import styles from './header.module.css';
import { useRouter } from "next/router";
import useSignedIn from "../../lib/hooks/use-signed-in";

const Header = ({ changeTheme, theme }: DriftProps) => {
    const router = useRouter();
    const [selectedTab, setSelectedTab] = useState<string>();
    const [expanded, setExpanded] = useState<boolean>(false)
    const [, setBodyHidden] = useBodyScroll(null, { scrollLayer: true })
    const isMobile = useMediaQuery('xs', { match: 'down' })
    const { isLoading, isSignedIn } = useSignedIn({ redirectIfNotAuthed: false })

    useEffect(() => {
        setBodyHidden(expanded)
    }, [expanded, setBodyHidden])

    useEffect(() => {
        if (!isMobile) {
            setExpanded(false)
        }
    }, [isMobile])
    const pages = useMemo(() => [
        {
            name: "Home",
            href: "/",
            icon: <HomeIcon />,
            condition: true,
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
        // {
        //     name: "Settings",
        //     href: "/settings",
        //     icon: <SettingsIcon />,
        //     condition: isSignedIn
        // },
        {
            name: "Sign out",
            action: () => {
                if (typeof window !== 'undefined') {
                    localStorage.clear();
                    router.push("/signin");
                }
            },
            href: "#signout",
            icon: <SignoutIcon />,
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
            action: function () {
                if (typeof window !== 'undefined') {
                    changeTheme();
                    setSelectedTab(undefined);
                }
            },
            icon: theme === 'light' ? <Moon /> : <Sun />,
            condition: true,
            value: "theme",
        }
    ], [changeTheme, isMobile, isSignedIn, router, theme])

    useEffect(() => {
        setSelectedTab(pages.find((page) => {
            if (page.href && page.href === router.asPath) {
                return true
            }
        })?.href)
    }, [pages, router, router.pathname])

    return (
        <Page.Header height={'var(--page-nav-height)'} margin={0} paddingBottom={0} paddingTop={"var(--gap)"}>
            <div className={styles.tabs}>
                <Tabs
                    value={selectedTab}
                    leftSpace={0}
                    activeClassName={styles.current}
                    align="center"
                    hideDivider
                    hideBorder
                    onChange={(tab) => {
                        const match = pages.find(page => page.value === tab)
                        if (match?.action) {
                            match.action()
                        } else if (match?.href) {
                            router.push(`${match.href}`)
                        }
                    }}>
                    {!isLoading && pages.map((tab) => {
                        if (tab.condition)
                            return <Tabs.Item
                                font="14px"
                                label={<>{tab.icon} {tab.name}</>}
                                value={tab.value}
                                key={`${tab.value}`}
                            />
                        else return null
                    })}
                </Tabs>
            </div>
            <div className={styles.controls}>
                <Button
                    auto
                    type="abort"
                    onClick={() => setExpanded(!expanded)}
                >
                    <Spacer height={5 / 6} width={0} />
                    <MenuIcon />
                </Button>
            </div>
            {isMobile && expanded && (<div className={styles.mobile}>
                <ButtonGroup vertical>
                    {pages.map((tab, index) => {
                        if (tab.condition)
                            return <Button
                                key={`${tab.name}-${index}`}
                                onClick={() => {
                                    const nameMatch = pages.find(page => page.name === tab.name)
                                    if (nameMatch?.action) {
                                        nameMatch.action()
                                    } else {
                                        router.push(`${tab.href}`)
                                    }
                                }}
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


// {/* {/* <ButtonGroup>
//                 <Button onClick={() => {

//                 }}><Link href="/signin">Sign out</Link></Button>
//                 <Button>
//                     <Link href="/mine">
//                         Yours
//                     </Link>
//                 </Button>
//                 <Button>
//                     {/* TODO: Link outside Button, but seems to break ButtonGroup */}
// <Link href="/new">
//     New
// </Link>
//                 </Button >
//     <Button onClick={() => changeTheme()}>
//         <ShiftBy y={6}>{theme.type === 'light' ? <Moon /> : <Sun />}</ShiftBy>
//     </Button>
//             </ButtonGroup > * /}