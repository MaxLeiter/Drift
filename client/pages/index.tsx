import styles from '@styles/Home.module.css'
import Header from '@components/header'
import Document from '@components/document'
import Image from 'next/image'
import ShiftBy from '@components/shift-by'
import PageSeo from '@components/page-seo'
import { Page, Text, Spacer } from '@geist-ui/core'

export function getStaticProps() {
  const introDoc = process.env.WELCOME_CONTENT
  return {
    props: {
      introContent: introDoc,
      introTitle: process.env.WELCOME_TITLE,
    }
  }
}

type Props = {
  introContent: string
}

const Home = ({ introContent }: Props) => {
  return (
    <Page className={styles.container}>
      <PageSeo />

      <Page.Header>
        <Header />
      </Page.Header>
      <Page.Content className={styles.main}>
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
