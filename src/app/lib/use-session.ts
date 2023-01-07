// A wrapper around next-auth/use-session that refreshes the page if the session changes

import { useEffect } from "react"
import { useSession as useSessionOriginal } from "next-auth/react"
import { useRouter } from "next/navigation"


export function useSession() {
    const { data: session, status } = useSessionOriginal()
    const router = useRouter();

    useEffect(() => {
        router.refresh();
    }, [router, status])

    return { session, status }
}
