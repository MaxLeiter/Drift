import styles from "@styles/Home.module.css"
import PageSeo from "@components/page-seo"
import HomeComponent from "@components/home"
import { Page, Text } from "@geist-ui/core/dist"
import type { GetStaticProps } from "next"
import { InferGetStaticPropsType } from "next"
type Props =
	| {
			introContent: string
			introTitle: string
			rendered: string
	  }
	| {
			error: boolean
	  }

export const getStaticProps: GetStaticProps = async () => {
	try {
		const resp = await fetch(process.env.API_URL + `/welcome`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"x-secret-key": process.env.SECRET_KEY || ""
			}
		})

		const { title, content, rendered } = await resp.json()
		return {
			props: {
				introContent: content || null,
				rendered: rendered || null,
				introTitle: title || null
			},
			// Next.js will attempt to re-generate the page:
			// - When a request comes in
			// - At most every 60 seconds
			revalidate: 60 // In seconds
		}
	} catch (err) {
		// If there was an error, it's likely due to the server not running, so we attempt to regenerate the page
		return {
			props: {
				error: true
			},
			revalidate: 10 // In seconds
		}
	}
}

// TODO: fix props type
const Home = ({
	rendered,
	introContent,
	introTitle,
	error
}: InferGetStaticPropsType<typeof getStaticProps>) => {
	return (
		<Page className={styles.wrapper}>
			<PageSeo />
			<Page.Content className={styles.main}>
				{error && <Text>Something went wrong. Is the server running?</Text>}
				{!error && (
					<HomeComponent
						rendered={rendered}
						introContent={introContent}
						introTitle={introTitle}
					/>
				)}
			</Page.Content>
		</Page>
	)
}

export default Home
