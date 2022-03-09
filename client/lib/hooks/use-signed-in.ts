import { useRouter } from "next/router";
import { useEffect } from "react"
import useSharedState from "./use-shared-state";

const useSignedIn = ({ redirectIfNotAuthed = false }: { redirectIfNotAuthed?: boolean }) => {
    const [isSignedIn, setSignedIn] = useSharedState('isSignedIn', false)
    const [isLoading, setLoading] = useSharedState('isLoading', true)
    const router = useRouter();
    if (redirectIfNotAuthed && !isLoading && isSignedIn === false) {
        router.push('/signin')
    }

    useEffect(() => {
        async function checkToken() {
            const token = localStorage.getItem('drift-token')
            if (token) {
                const response = await fetch('/api/users/verify-token', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                if (response.ok) {
                    setSignedIn(true)
                }
            }
            setLoading(false)
        }
        setLoading(true)
        checkToken()

        const interval = setInterval(() => {
            checkToken()
        }, 60 * 1000);

        return () => clearInterval(interval);
    }, [setLoading, setSignedIn])

    return { isSignedIn, isLoading }
}

export default useSignedIn
