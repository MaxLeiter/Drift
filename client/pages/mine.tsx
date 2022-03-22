import styles from '@styles/Home.module.css'
import Page from '@geist-ui/core/dist/page'

import Header from '@components/header'
import MyPosts from '@components/my-posts'
import cookie from "cookie";
import type { GetServerSideProps } from 'next';
import type { ThemeProps } from '@lib/types';

const Home = ({ posts, error, theme, changeTheme }: ThemeProps & { posts: any; error: any; }) => {
  return (
    <Page className={styles.container} width="100%">
      <Page.Header>
        <Header theme={theme} changeTheme={changeTheme} />
      </Page.Header>
      <Page.Content paddingTop={"var(--gap)"} width={"var(--main-content-width)"} margin="0 auto" className={styles.main}>
        <MyPosts error={error} posts={posts} />
      </Page.Content>
    </Page >
  )
}
// get server side props 
export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const driftToken = cookie.parse(req.headers.cookie || '')[`drift-token`]
  if (!driftToken) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  const posts = await fetch(process.env.API_URL + `/posts/mine`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${driftToken}`,
      "x-secret-key": process.env.SECRET_KEY || ''
    }
  })

  if (!posts.ok || posts.status !== 200) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  return {
    props: {
      posts: await posts.json(),
      error: posts.status !== 200,
    }
  }
}

export default Home
