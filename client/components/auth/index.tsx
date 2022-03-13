import { FormEvent, useState } from 'react'
import { Button, Card, Input, Text } from '@geist-ui/core'
import styles from './auth.module.css'
import { useRouter } from 'next/router'
import Link from '../Link'

const Auth = ({ page }: { page: "signup" | "signin" }) => {
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const signingIn = page === 'signin'

    const NO_EMPTY_SPACE_REGEX = /^\S*$/;

    const handleJson = (json: any) => {
        if (json.error) return setError(json.error.message)

        localStorage.setItem('drift-token', json.token)
        localStorage.setItem('drift-userid', json.userId)
        router.push('/')
    }


    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!username.match(NO_EMPTY_SPACE_REGEX))
            return setError("Username can't be empty")

        if (!password.match(NO_EMPTY_SPACE_REGEX))
            return setError("Password can't be empty")

        const reqOpts = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        }

        try {
            const signUrl = signingIn ? '/server-api/auth/signin' : '/server-api/auth/signup';
            const resp = await fetch(signUrl, reqOpts);
            const json = await resp.json();

            if (!resp.ok) throw new Error();

            handleJson(json)
        } catch (err: any) {
            setError(err.message || "Something went wrong")
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.form}>
                <div className={styles.formHeader}>
                    <h1>{signingIn ? 'Sign In' : 'Sign Up'}</h1>
                </div>
                <form onSubmit={handleSubmit}>
                    <Card>
                        <div className={styles.formGroup}>
                            <Input
                                htmlType="text"
                                id="username"
                                value={username}
                                onChange={(event) => setUsername(event.target.value)}
                                placeholder="Username"
                                required
                                label='Username'
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <Input
                                htmlType='password'
                                id="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder="Password"
                                required
                                label='Password'
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Button type="success" ghost htmlType="submit">{signingIn ? 'Sign In' : 'Sign Up'}</Button>
                        </div>
                        <div className={styles.formGroup}>
                            {signingIn ? (
                                <Text>
                                    Don&apos;t have an account?{" "}
                                    <Link color href="/signup">Sign up</Link>
                                </Text>
                            ) : (
                                <Text>
                                    Already have an account?{" "}
                                    <Link color href="/signin">Sign in</Link>
                                </Text>
                            )}
                        </div>
                        {error && <Text type='error'>{error}</Text>}
                    </Card>
                </form>
            </div>
        </div >
    )
}

export default Auth