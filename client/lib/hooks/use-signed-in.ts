import { useRouter } from "next/router";
import { useCallback, useEffect } from "react"
import useSharedState from "./use-shared-state";

const useSignedIn = ({ redirectIfNotAuthed = false }: { redirectIfNotAuthed?: boolean }) => {
    const [isSignedIn, setSignedIn] = useSharedState('isSignedIn', false)
    const [isLoading, setLoading] = useSharedState('isLoading', true)
    const signout = useCallback(() => setSignedIn(false), [setSignedIn])

    const router = useRouter();
    if (redirectIfNotAuthed && !isLoading && isSignedIn === false) {
        router.push('/signin')
    }

    useEffect(() => {
        async function checkToken() {
            const token = localStorage.getItem('drift-token')
            if (token) {
                const response = await fetch('/api/auth/verify-token', {
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
        }, 10000);

        return () => clearInterval(interval);
    }, [setLoading, setSignedIn])

    return { isSignedIn, isLoading, signout }
}

export default useSignedIn
