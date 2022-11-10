import React from "react"

type PageSeoProps = {
	title?: string
	description?: string
	isLoading?: boolean
	isPrivate?: boolean
}

const PageSeo = ({
	title = "Drift",
	description = "A self-hostable clone of GitHub Gist",
	isPrivate = false
}: PageSeoProps) => {
	return (
		<>
			<title>Drift - {title}</title>
			{!isPrivate && <meta name="description" content={description} />}
		</>
	)
}

export default PageSeo
