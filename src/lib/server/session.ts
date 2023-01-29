import type { GetServerSidePropsContext } from "next"
import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth"

type Params = {
	req: GetServerSidePropsContext["req"]
	res: GetServerSidePropsContext["res"]
}

export async function getSession(params?: Params) {
	if (!params) return await getServerSession(authOptions)
	return await getServerSession(params.req, params.res, authOptions)
}

export async function getCurrentUser(params?: Params) {
	const session = await getSession(params)

	return session?.user
}
