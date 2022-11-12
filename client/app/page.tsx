import Header from "@components/header"
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
		<>
			<Header signedIn={Boolean(authed)}/>
			<Home rendered={rendered} introContent={content} introTitle={title} />
		</>
	)
}
