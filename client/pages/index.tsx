import styles from '../styles/Home.module.css'
import { Page, Spacer, Text } from '@geist-ui/core'

import Header from '../components/header'
import { ThemeProps } from './_app'
import Document from '../components/document'
import Image from 'next/image'
import ShiftBy from '../components/shift-by'
import PageSeo from 'components/page-seo'

export function getStaticProps() {
  const introDoc = process.env.WELCOME_CONTENT
  return {
    props: {
      introContent: introDoc,
      introTitle: process.env.WELCOME_TITLE,
    }
  }
}

type Props = ThemeProps & {
  introContent: string
}

const Home = ({ theme, changeTheme, introContent }: Props) => {
  return (
    <Page className={styles.container} width="100%">
      <PageSeo />


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
      </Page.Content>
    </Page>
  )
}

export default Home
