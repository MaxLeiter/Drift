import { getWelcomeContent } from "pages/api/welcome"
import Home from "./home"

const getWelcomeData = async () => {
	const welcomeContent = await getWelcomeContent()
	return welcomeContent
}

export default async function Page() {
	const { content, rendered, title } = await getWelcomeData()

	return <Home rendered={rendered} introContent={content} introTitle={title} />
}
