import { FormEvent, useState } from 'react'
import { Button, Input, Text, useToasts } from '@geist-ui/core'
import styles from './auth.module.css'
import { useRouter } from 'next/router'
import Link from '../Link'

const Auth = ({ page }: { page: "signup" | "signin" }) => {
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { setToast } = useToasts();

    const signingIn = page === 'signin'

    const handleJson = (json: any) => {
        localStorage.setItem('drift-token', json.token)
        localStorage.setItem('drift-userid', json.userId)
        router.push('/')
    }


    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

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
            setToast({ text: "Something went wrong", type: 'error' })
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.form}>
                <div className={styles.formContentSpace}>
                    <h1>{signingIn ? 'Sign In' : 'Sign Up'}</h1>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <Input
                            htmlType="text"
                            id="username"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            placeholder="Username"
                            required
                            scale={4 / 3}
                        />
                        <Input
                            htmlType='password'
                            id="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Password"
                            required
                            scale={4 / 3}
                        />
                        <Button type="success" htmlType="submit">{signingIn ? 'Sign In' : 'Sign Up'}</Button>
                    </div>
                    <div className={styles.formContentSpace}>
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
                </form>
            </div>
        </div >
    )
}

export default Auth