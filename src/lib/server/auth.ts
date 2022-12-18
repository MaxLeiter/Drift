import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@lib/server/prisma"
import config from "@lib/config"
import * as crypto from "crypto"

const providers: NextAuthOptions["providers"] = [
	GitHubProvider({
		clientId: config.github_client_id,
		clientSecret: config.github_client_secret
	}),
	CredentialsProvider({
		name: "Credentials",
		credentials: {
			username: { label: "Username", type: "text", placeholder: "jsmith" },
			password: { label: "Password", type: "password" }
		},
		async authorize(credentials) {
			if (!credentials) {
				return null
			}

			const user = await prisma.user.findUnique({
				where: {
					username: credentials.username
				},
				select: {
					id: true,
					username: true,
					displayName: true,
					role: true,
					password: true
				}
			})

			const hashedPassword = crypto
				.createHash("sha256")
				.update
				(credentials
					.password
					+ config.nextauth_secret)
				.digest("hex")

			if (!user) {
				const newUser = await prisma.user.create({
					data: {
						username: credentials.username,
						displayName: credentials.username,
						role: "user",
						password: hashedPassword,
						name: credentials.username,
					}
				})

				return newUser
			} else if (
				user.password &&
				crypto.timingSafeEqual(
					Buffer.from(user.password),
					Buffer.from(hashedPassword)
				)
			) {
				return user
			}

			return null
		}
	})
]

export const authOptions: NextAuthOptions = {
	// see https://github.com/prisma/prisma/issues/16117 / https://github.com/shadcn/taxonomy
	adapter: PrismaAdapter(prisma as any),
	session: {
		strategy: "jwt"
	},
	pages: {
		signIn: "/signin"
		// TODO
		// error: "/auth/error",
	},
	providers,
	callbacks: {
		async session({ token, session }) {
			if (token) {
				session.user.id = token.id
				session.user.name = token.name
				session.user.email = token.email
				session.user.image = token.picture
				session.user.role = token.role
			}

			return session
		},
		async jwt({ token, user }) {
			const dbUser = await prisma.user.findFirst({
				where: {
					OR: [
						{
							username: user?.username
						},
						{
							email: user?.email
						}
					]
				}
			})

			if (!dbUser) {
				// TODO: user should be defined? should we invalidate/signout?
				if (user) {
					token.id = user.id
				}
				return token
			}

			return {
				id: dbUser.id,
				name: dbUser.displayName,
				email: dbUser.email,
				picture: dbUser.image,
				role: dbUser.role || "user",
				username: dbUser.username
			}
		}
	}
} as const
