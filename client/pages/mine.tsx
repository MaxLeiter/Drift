import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { Page } from '@geist-ui/core'

import Header from '../components/header'
import useSignedIn from '../lib/hooks/use-signed-in'
import { Loader } from '@geist-ui/icons'
import MyPosts from '../components/my-posts'

const Home = ({ theme, changeTheme }: { theme: "light" | "dark", changeTheme: () => void }) => {
  const { isLoading, isSignedIn } = useSignedIn({ redirectIfNotAuthed: true })

  return (
    <Page className={styles.container}>
      <Head>
        <title>Drift</title>
        <meta name="description" content="A self-hostable clone of GitHub Gist" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Page.Header>
        <Header theme={theme} changeTheme={changeTheme} />
      </Page.Header>
      <Page.Content width={"var(--main-content-width)"} margin="0 auto" className={styles.main}>
        {isLoading && <div style={{ margin: "0 auto" }}><Loader /></div>}
        {isSignedIn && <MyPosts />}
      </Page.Content>
    </Page >
  )
}

export default Home
