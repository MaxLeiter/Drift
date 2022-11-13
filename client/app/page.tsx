import Header from "@components/header"
import PageWrapper from "@components/page-wrapper"
import { getCurrentUser } from "@lib/server/session"
import { getWelcomeContent } from "pages/api/welcome"
import Home from "./components/home"

const getWelcomeData = async () => {
	const welcomeContent = await getWelcomeContent()
	return welcomeContent
}

export default async function Page() {
	const { content, rendered, title } = await getWelcomeData()
	const authed = await getCurrentUser();

	return (
		<PageWrapper signedIn={Boolean(authed)}>
			<Home rendered={rendered as string} introContent={content} introTitle={title} />
		</PageWrapper>
	)
}
