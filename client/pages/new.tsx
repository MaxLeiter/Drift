import Head from 'next/head'
import styles from '../styles/Home.module.css'
import HomeComponent from '../components/post'
import { Button, ButtonGroup, Loading, Page } from '@geist-ui/core'
import { Sun, Moon } from '@geist-ui/icons'
import ShiftBy from '../components/shift-by'
import useSignedIn from '../lib/hooks/use-signed-in'
import Link from '../components/Link'

const Home = ({ theme, changeTheme }: { theme: "light" | "dark", changeTheme: () => void }) => {
  const { isLoading, isSignedIn } = useSignedIn({ redirectIfNotAuthed: true })
  return (
    <Page className={styles.container}>
      <Head>
        <title>Drift</title>
        <meta name="description" content="A self-hostable clone of GitHub Gist" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {isSignedIn && <Page.Header height={'40px'} margin={0} paddingBottom={0} paddingTop={"var(--gap)"}>
        <ButtonGroup>
          <Button onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}>Sign out</Button>
          <Button>
            {/* TODO: Link outside Button, but seems to break ButtonGroup */}
            <Link href="/mine">
              Your Posts
            </Link>
          </Button>
          <Button onClick={() => changeTheme()}>
            <ShiftBy y={6}>{theme === 'light' ? <Moon /> : <Sun />}</ShiftBy>
          </Button>
        </ButtonGroup>
      </Page.Header>}

      <Page.Content width={"var(--main-content-width)"} margin="0 auto" className={styles.main}>
        {isLoading && <Loading />}
        {!isLoading && isSignedIn && <HomeComponent />}
      </Page.Content>
    </Page >
  )
}

export default Home
