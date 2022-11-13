import Header from "@components/header"
import NewPost from "app/(posts)/new/components/new"
import "@styles/react-datepicker.css"
import PageWrapper from "@components/page-wrapper"

const New = () => (
	<PageWrapper signedIn>
		<NewPost />
	</PageWrapper>
)

export default New
