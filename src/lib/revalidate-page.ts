import config from "./config"

export const revalidatePage = async (path: string) => {
	const res = await fetch(
		`${process.env.DRIFT_URL}/api/revalidate?secret=${config.nextauth_secret}&path=${path}`
	)
	const json = await res.json()
	return json
}
