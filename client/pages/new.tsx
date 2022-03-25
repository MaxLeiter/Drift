import styles from '@styles/Home.module.css'
import NewPost from '@components/new-post'
import Header from '@components/header'
import PageSeo from '@components/page-seo'
import { Page } from '@geist-ui/core'

const New = () => {
  return (
    <Page className={styles.wrapper}>
      <PageSeo title="Drift - New" />

      <Page.Header>
        <Header />
      </Page.Header>

      <Page.Content className={styles.main}>
        <NewPost />
      </Page.Content>
    </Page >
  )
}

export default New
