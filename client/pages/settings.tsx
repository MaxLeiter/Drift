import { Button, Divider, Text, Fieldset, Input, Page, Note, Textarea } from "@geist-ui/core"
import PageSeo from "@components/page-seo"
import styles from "@styles/Home.module.css"
import SettingsPage from "@components/settings"

const Settings = () => (
    <Page width={"100%"}>
        <PageSeo title="Drift - Settings" />
        <Page.Content className={styles.main} style={{ gap: 'var(--gap)', display: 'flex', flexDirection: 'column' }}>
            <SettingsPage />
        </Page.Content>
    </Page>
)

export default Settings
