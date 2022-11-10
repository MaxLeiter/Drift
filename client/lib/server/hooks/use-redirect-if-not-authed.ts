import { useRouter } from "next/navigation"
import { isSignedIn } from "../is-signed-in"

export const useRedirectIfNotAuthed = (to = "/signin") => {
	const router = useRouter()

	const signedIn = isSignedIn()

	if (!signedIn) {
		router.push(to)
	}
}
