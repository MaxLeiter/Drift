import styles from '@styles/Home.module.css'
import NewPost from '@components/new-post'
import Header from '@components/header'
import PageSeo from '@components/page-seo'
import { Page } from '@geist-ui/core'
import Head from 'next/head'

const New = () => {
  return (
    <Page className={styles.wrapper}>
      <PageSeo title="Create a new Drift" />
      <Head>
        {/* TODO: solve this. */}
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href="/css/react-datepicker.css" />
      </Head>
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
