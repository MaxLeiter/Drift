"use client"
import Toast, { Toaster } from "react-hot-toast"

export type ToastType = "success" | "error" | "loading" | "default"

export type ToastProps = {
	id?: string
	type: ToastType
	message: string
	duration?: number
	icon?: string
	style?: React.CSSProperties
	className?: string
	loading?: boolean
	loadingProgress?: number
}

export const useToasts = () => {
	const setToast = (toast: ToastProps) => {
		const { type, message, ...rest } = toast
		if (toast.id) {
			Toast.dismiss(toast.id)
		}

		switch (type) {
			case "success":
				Toast.success(message, rest)
				break
			case "error":
				Toast.error(message, rest)
				break
			case "loading":
				Toast.loading(message, rest)
				break
			default:
				Toast(message, rest)
				break
		}
	}

	return { setToast }
}

export const Toasts = () => {
	return (
		<Toaster
			position="bottom-right"
			toastOptions={{
				error: {
					style: {
						background: "var(--warning)",
						color: "#fff"
					}
				},
				success: {
					style: {
						background: "var(--light-gray)",
						color: "var(--fg)"
					}
				},
				iconTheme: {
					primary: "var(--fg)",
					secondary: "var(--bg)"
				}
			}}
		/>
	)
}
