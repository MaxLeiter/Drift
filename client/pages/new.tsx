import styles from '@styles/Home.module.css'
import NewPost from '@components/new-post'
import Page from '@geist-ui/core/dist/page'
import Header from '@components/header'
import PageSeo from '@components/page-seo'
import type { ThemeProps } from '@lib/types'

const New = ({ theme, changeTheme }: ThemeProps) => {
  return (
    <Page className={styles.container} width="100%">
      <PageSeo title="Drift - New" />

      <Page.Header>
        <Header theme={theme} changeTheme={changeTheme} />
      </Page.Header>

      <Page.Content paddingTop={"var(--gap)"} width={"var(--main-content-width)"} margin="0 auto" className={styles.main}>
        <NewPost />
      </Page.Content>
    </Page >
  )
}

export default New
