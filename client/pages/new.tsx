import styles from '@styles/Home.module.css'
import NewPost from '@components/new-post'
import Header from '@components/header'
import PageSeo from '@components/page-seo'
import { Page } from '@geist-ui/core'
import Head from 'next/head'

const New = () => {
  return (
    <Page className={styles.wrapper}>
      <PageSeo title="Drift - New" />
      <Head>
        {/* <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/react-datepicker/4.7.0/react-datepicker.min.css" /> */}
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
