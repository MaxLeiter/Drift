import { getMetadata } from "src/app/lib/metadata"
import NewPost from "src/app/(drift)/(posts)/new/components/new"
import "./components/react-datepicker.css"
import { PageTitle } from "@components/page-title"
import { PageWrapper } from "@components/page-wrapper"

export default function New() {
	return (
		<>
			<PageTitle>New Post</PageTitle>
			<PageWrapper>
				<NewPost />
			</PageWrapper>
		</>
	)
}

export const metadata = getMetadata({
	title: "New post",
	hidden: true
})
