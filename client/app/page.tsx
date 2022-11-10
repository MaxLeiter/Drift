import { getWelcomeContent } from "pages/api/welcome"

const getWelcomeData = async () => {
	const welcomeContent = await getWelcomeContent()
	return welcomeContent
}

export default async function Page() {
	const welcomeData = await getWelcomeData()
    
	return <h1>{JSON.stringify(welcomeData)}</h1>
}
