import { Page } from "@geist-ui/core"
import PageSeo from "@components/page-seo"
import Auth from "@components/auth"
import styles from "@styles/Home.module.css"
const SignIn = () => (
	<Page width={"100%"}>
		<PageSeo title="Drift - Sign In" />
		<Page.Content className={styles.main}>
			<Auth page="signin" />
		</Page.Content>
	</Page>
)

export default SignIn
