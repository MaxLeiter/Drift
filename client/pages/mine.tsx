import styles from '@styles/Home.module.css'

import Header from '@components/header'
import MyPosts from '@components/my-posts'
import cookie from "cookie";
import type { GetServerSideProps } from 'next';
import { Post } from '@lib/types';
import { Page } from '@geist-ui/core';

const Home = ({ posts, error }: { posts: Post[]; error: any; }) => {
  return (
    <Page className={styles.container}>
      <Page.Header>
        <Header />
      </Page.Header>
      <Page.Content className={styles.main}>
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
