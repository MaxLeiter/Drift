import styles from "@styles/Home.module.css"

import Header from "@components/header"
import { Page } from "@geist-ui/core"
import { useEffect } from "react"
import Admin from "@components/admin"
import useSignedIn from "@lib/hooks/use-signed-in"
import { useRouter } from "next/router"
import { GetServerSideProps } from "next"
import cookie from "cookie"

const AdminPage = () => {
	const { signedIn } = useSignedIn()
	const router = useRouter()
	useEffect(() => {
		if (typeof window === "undefined") return
		if (!signedIn) {
			router.push("/")
		}
	}, [router, signedIn])
	return (
		<Page className={styles.wrapper}>
			<Page.Content className={styles.main}>
				<Admin />
			</Page.Content>
		</Page>
	)
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	const driftToken = cookie.parse(req.headers.cookie || "")[`drift-token`]
	const res = await fetch(`${process.env.API_URL}/admin/is-admin`, {
		headers: {
			Authorization: `Bearer ${driftToken}`,
			"x-secret-key": process.env.SECRET_KEY || ""
		}
	})

	if (res.ok) {
		return {
			props: {
				signedIn: true
			}
		}
	} else {
		return {
			redirect: {
				destination: "/",
				permanent: false
			}
		}
	}
}

export default AdminPage
