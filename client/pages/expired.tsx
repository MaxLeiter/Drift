import Header from "@components/header"
import { Note, Page, Text } from "@geist-ui/core"
import styles from '@styles/Home.module.css'

const Expired = () => {
    return (
        <Page>
            <Page.Content className={styles.main}>
                <Note type="error" label={false}>
                    <Text h4>Error: The Drift you&apos;re trying to view has expired.</Text>
                </Note>

            </Page.Content>
        </Page>
    )
}

export default Expired
