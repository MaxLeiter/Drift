import { Text, Fieldset, Spacer } from "@geist-ui/core"
import { Post, User } from "@lib/types"
import Cookies from "js-cookie"
import { useEffect, useMemo, useState } from "react"
import styles from "./admin.module.css"
import PostModal from "./post-modal-link"
import PostTable from "./post-table"
import UserTable from "./user-table"

export const adminFetcher = async (
	url: string,
	options?: {
		method?: string
		body?: any
	}
) =>
	fetch("/server-api/admin" + url, {
		method: options?.method || "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${Cookies.get("drift-token")}`
		},
		body: options?.body && JSON.stringify(options.body)
	})

const Admin = () => {
	return (
		<div className={styles.adminWrapper}>
			<Text h2>Administration</Text>
			<UserTable />
			<Spacer height={1} />
			<PostTable />
		</div>
	)
}

export default Admin
