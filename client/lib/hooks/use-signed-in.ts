import { useRouter } from "next/router";
import { useState, useEffect } from "react"

const useSignedIn = ({ redirectIfNotAuthed = false }: { redirectIfNotAuthed?: boolean }) => {
    const [isSignedIn, setSignedIn] = useState(false)
    const [isLoading, setLoading] = useState(true)
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
    }, [])

    return { isSignedIn, isLoading }
}

export default useSignedIn