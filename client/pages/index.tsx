import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { Page } from '@geist-ui/core'

import Header from '../components/header'
import { ThemeProps } from './_app'
import Document from '../components/document'
const Home = ({ theme, changeTheme }: ThemeProps) => {
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
      <Page.Content width={"var(--main-content-width)"} margin="auto">
        <Document
          editable={false}
          content={
            `# Welcome to Drift
### Drift is a self-hostable clone of GitHub Gist.
#### It is a simple way to share code and text snippets with your friends, with support for the following:

- Render GitHub Extended Markdown and LaTeX (including images)
- User authentication
- Private, public, and secret posts

If you need to signup, you can join at [/signup](/signup). If you're already signed in, you can create a new post by clicking the "New" button in the header.
`}
          title={`Welcome to Drift`}
          initialTab={`preview`}
        />

      </Page.Content>
    </Page >
  )
}

export default Home
