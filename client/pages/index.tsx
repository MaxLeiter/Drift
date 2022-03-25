import styles from '@styles/Home.module.css'
import Header from '@components/header'
import PageSeo from '@components/page-seo'
import HomeComponent from '@components/home'
import { Page, Text, Spacer, Tabs, Textarea, Card } from '@geist-ui/core'

export async function getStaticProps() {
  const resp = await fetch(process.env.API_URL + `/welcome`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-secret-key": process.env.SECRET_KEY || ''
      }
    })

  const { title, content, rendered } = await resp.json()
  return {
    props: {
      introContent: content || null,
      rendered: rendered || null,
      introTitle: title || null,
    }
  }
}

type Props = {
  introContent: string
  introTitle: string
  rendered: string
}

const Home = ({ rendered, introContent, introTitle }: Props) => {
  return (
    <Page className={styles.wrapper}>
      <PageSeo />
      <Page.Header>
        <Header />
      </Page.Header>
      <Page.Content className={styles.main}>
        <HomeComponent rendered={rendered} introContent={introContent} introTitle={introTitle} />
      </Page.Content>
    </Page>
  )
}

export default Home
