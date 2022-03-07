import Head from 'next/head'
import styles from '../styles/Home.module.css'
import HomeComponent from '../components/post'
import { Loading, Page } from '@geist-ui/core'
import useSignedIn from '../lib/hooks/use-signed-in'
import Header from '../components/header'
import { ThemeProps } from './_app'

const Home = ({ theme, changeTheme }: ThemeProps) => {
  const { isSignedIn, isLoading } = useSignedIn({ redirectIfNotAuthed: true })

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
        {isLoading && <Loading />}
        {isSignedIn && <HomeComponent />}
      </Page.Content>
    </Page >
  )
}

export default Home
