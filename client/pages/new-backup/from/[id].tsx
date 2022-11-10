import styles from "@styles/Home.module.css"
import NewPost from "@components/new-post"
import Header from "@components/header"
import PageSeo from "@components/page-seo"
import { Page } from "@geist-ui/core/dist"
import Head from "next/head"
import { GetServerSideProps } from "next"
import { Post } from "@lib/types"
import cookie from "cookie"

const NewFromExisting = ({
	post,
	parentId
}: {
	post: Post
	parentId: string
}) => {
	return (
		<Page className={styles.wrapper}>
			<PageSeo title="Create a new Drift" />
			<Head>
				{/* TODO: solve this. */}
				{/* eslint-disable-next-line @next/next/no-css-tags */}
				<link rel="stylesheet" href="/css/react-datepicker.css" />
			</Head>
			<Page.Content className={styles.main}>
				<NewPost initialPost={post} newPostParent={parentId} />
			</Page.Content>
		</Page>
	)
}

export const getServerSideProps: GetServerSideProps = async ({
	req,
	params
}) => {
	const id = params?.id
	const redirect = {
		redirect: {
			destination: "/new",
			permanent: false
		}
	}

	if (!id) {
		return redirect
	}

	const driftToken = cookie.parse(req.headers.cookie || "")[`drift-token`]

	const post = await fetch(`${process.env.API_URL}/posts/${id}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${driftToken}`,
			"x-secret-key": process.env.SECRET_KEY || ""
		}
	})

	if (!post.ok) {
		return redirect
	}

	const data = await post.json()

	if (!data) {
		return redirect
	}

	return {
		props: {
			post: data,
			parentId: id
		}
	}
}

export default NewFromExisting
