import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { Page } from '@geist-ui/core'

import Header from '../components/header'
import MyPosts from '../components/my-posts'

const Home = ({ theme, changeTheme }: { theme: "light" | "dark", changeTheme: () => void }) => {
  return (
    <Page className={styles.container} width="100%">
      <Head>
        <title>Drift</title>
        <meta name="description" content="A self-hostable clone of GitHub Gist" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Page.Header>
        <Header theme={theme} changeTheme={changeTheme} />
      </Page.Header>
      <Page.Content paddingTop={"var(--gap)"} width={"var(--main-content-width)"} margin="0 auto" className={styles.main}>
        <MyPosts />
      </Page.Content>
    </Page >
  )
}

export default Home
