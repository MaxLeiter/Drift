import styles from '@styles/Home.module.css'

import Header from '@components/header'
import { Page } from '@geist-ui/core';
import { useEffect } from 'react';
import Settings from '@components/settings';
import useSignedIn from '@lib/hooks/use-signed-in';
import { useRouter } from 'next/router';

const SettingsPage = () => {
    const { signedIn } = useSignedIn()
    const router = useRouter()
    useEffect(() => {
        console.log("here", signedIn)
        if (typeof window === 'undefined') return
        if (!signedIn) {
            console.log("here")
            router.push('/')
        }
    }, [router, signedIn])
    return (
        <Page className={styles.wrapper}>
            <Page.Header>
                <Header />
            </Page.Header>
            <Page.Content className={styles.main}>
                <Settings />
            </Page.Content>
        </Page >
    )
}
export default SettingsPage
