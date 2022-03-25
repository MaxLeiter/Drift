import styles from '@styles/Home.module.css'

import Header from '@components/header'
import MyPosts from '@components/my-posts'
import cookie from "cookie";
import type { GetServerSideProps } from 'next';
import { Post } from '@lib/types';
import { Page } from '@geist-ui/core';

const Home = ({ morePosts, posts, error }: { morePosts: boolean, posts: Post[]; error: boolean; }) => {
  return (
    <Page className={styles.wrapper}>
      <Page.Header>
        <Header />
      </Page.Header>
      <Page.Content className={styles.main}>
        <MyPosts morePosts={morePosts} error={error} posts={posts} />
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

  const posts = await fetch(process.env.API_URL + `/posts/mine?page=1`, {
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

  const data = await posts.json()

  return {
    props: {
      posts: data,
      error: posts.status !== 200,
      morePosts: data.length > 10,
    }
  }
}

export default Home
