"use client"

import { useToasts } from "@components/toasts"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"

export function ErrorQueryParamsHandler() {
	const queryParams = useSearchParams()
	const { setToast } = useToasts()

	useEffect(() => {
		if (queryParams.get("error")) {
			setToast({
				message: queryParams.get("error") as string,
				type: "error"
			})
		}
	}, [queryParams, setToast])

	return null
}
