import { getWelcomeContent } from "pages/api/welcome"
import Home from "./components/home"

const getWelcomeData = async () => {
	const welcomeContent = await getWelcomeContent()
	return welcomeContent
}

export default async function Page() {
	const { content, rendered, title } = await getWelcomeData()

	return (
		<Home
			rendered={rendered as string}
			introContent={content}
			introTitle={title}
		/>
	)
}
