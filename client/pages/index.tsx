import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { Page, Spacer, Text } from '@geist-ui/core'

import Header from '../components/header'
import { ThemeProps } from './_app'
import Document from '../components/document'
import Image from 'next/image'
import ShiftBy from '../components/shift-by'

export function getStaticProps() {
  const introDoc = `### Drift is a self-hostable clone of GitHub Gist.
#### It is a simple way to share code and text snippets with your friends, with support for the following:
  
  - Render GitHub Extended Markdown (including images)
  - User authentication
  - Private, public, and secret posts
  
  If you want to signup, you can join at [/signup](/signup) as long as you have a passcode provided by the administrator (which you don't need for this demo).
  **This demo is on a memory-only database, so accounts and pastes can be deleted at any time.**
  You can find the source code on [GitHub](https://github.com/MaxLeiter/drift).
  
  Drift was inspired by [this tweet](https://twitter.com/emilyst/status/1499858264346935297):
  > What is the absolute closest thing to GitHub Gist that can be self-hosted?
    In terms of design and functionality. Hosts images and markdown, rendered. Creates links that can be private or public. Uses/requires registration.
    I have looked at dozens of pastebin-like things.
  `
  const todoDoc =
    `#### In no particular order:

- Less JavaScript usage (it's currently required)
- A non-Node backend
- Hosting images
- Password-protected posts
- Administrator panel
- Meta tags
- User settings
- Search
- "Forking"
- LaTeX
- Syntax highlighting based on filename ending`

  return {
    props: {
      introContent: introDoc,
      todoContent: todoDoc,
    }
  }
}

type Props = ThemeProps & {
  introContent: string
  todoContent: string
}

const Home = ({ theme, changeTheme, introContent, todoContent }: Props) => {
  return (
    <Page className={styles.container} width="100%">
      <Head>
        <title>Drift</title>
        <meta name="description" content="A self-hostable clone of GitHub Gist" />
      </Head>
      <Page.Header>
        <Header theme={theme} changeTheme={changeTheme} />
      </Page.Header>
      <Page.Content width={"var(--main-content-width)"} margin="auto" paddingTop={"var(--gap)"}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <ShiftBy y={-2}><Image src={'/assets/logo-optimized.svg'} width={'48px'} height={'48px'} alt="" /></ShiftBy>
          <Spacer />
          <Text style={{ display: 'inline' }} h1> Welcome to Drift</Text>
        </div>
        <Document
          editable={false}
          content={introContent}
          title={`Welcome to Drift.md`}
          initialTab={`preview`}
        />
        <Document
          editable={false}
          content={todoContent}
          title={`TODO.md`}
          initialTab={`preview`}
        />
      </Page.Content>
    </Page >
  )
}

export default Home
