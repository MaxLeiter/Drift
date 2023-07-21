"use client"

import { useToasts } from "@components/toasts"
import { useSearchParams } from "next/navigation"
import { Suspense, useEffect } from "react"

function InnerErrorQueryParamsHandler() {
	const queryParams = useSearchParams()
	const { setToast } = useToasts()

	useEffect(() => {
		if (queryParams?.get("error")) {
			setToast({
				message: queryParams.get("error") as string,
				type: "error"
			})
		}
	}, [queryParams, setToast])

	return null
}

export function ErrorQueryParamsHandler() {
	/* Suspense boundary because useSearchParams causes static bailout */
	return (
		<Suspense fallback={null}>
			<InnerErrorQueryParamsHandler />
		</Suspense>
	)
}
