import Header from "app/components/header"
import NewPost from "app/(posts)/new/components/new"
import "@styles/react-datepicker.css"

const New = () => <>
    <Header signedIn />
    <NewPost />
</>

export default New
