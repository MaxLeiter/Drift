import type { GetServerSidePropsContext } from "next"
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "./auth"

type Params = {
	req: GetServerSidePropsContext["req"]
	res: GetServerSidePropsContext["res"]
}

export async function getSession(params?: Params) {
	if (!params) return await unstable_getServerSession(authOptions)
	return await unstable_getServerSession(params.req, params.res, authOptions)
}

export async function getCurrentUser(params?: Params) {
	const session = await getSession(params)

	return session?.user
}
