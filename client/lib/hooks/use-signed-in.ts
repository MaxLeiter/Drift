import Cookies from "js-cookie"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import useSharedState from "./use-shared-state"

const useSignedIn = () => {
  const [signedIn, setSignedIn] = useSharedState(
    "signedIn",
    typeof window === "undefined" ? false : !!Cookies.get("drift-token")
  )
  const token = Cookies.get("drift-token")
  const router = useRouter()
  const signin = (token: string) => {
    setSignedIn(true)
    Cookies.set("drift-token", token)
  }

  const signout = () => {
    setSignedIn(false)
    Cookies.remove("drift-token")
    router.push("/")
  }

  useEffect(() => {
    if (token) {
      setSignedIn(true)
    } else {
      setSignedIn(false)
    }
  }, [setSignedIn, token])

  return { signedIn, signin, token, signout }
}

export default useSignedIn
