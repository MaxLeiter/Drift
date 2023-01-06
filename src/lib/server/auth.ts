import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@lib/server/prisma"
import config from "@lib/config"
import * as crypto from "crypto"

const credentialsOptions = () => {
	const options: Record<string, unknown> = {
		username: {
			label: "Username",
			required: true,
			type: "text"
		},
		password: {
			label: "Password",
			required: true,
			type: "password"
		}
	}

	if (config.registration_password) {
		options["registration_password"] = {
			label: "Server Password",
			type: "password",
			optional: true
		}
	}

	return options
}
const providers = () => {
	const providers = []

	if (config.github_client_id && config.github_client_secret) {
		providers.push(
			GitHubProvider({
				clientId: config.github_client_id,
				clientSecret: config.github_client_secret
			})
		)
	}

	if (config.credential_auth) {
		providers.push(
			CredentialsProvider({
				name: "Drift",
				// @ts-expect-error TODO: fix types
				credentials: credentialsOptions() as unknown,
				async authorize(credentials) {
					if (!credentials || !credentials.username || !credentials.password) {
						throw new Error("Missing credentials")
					}

					if (credentials.username.length < 3) {
						throw new Error("Username must be at least 3 characters")
					}

					if (credentials.password.length < 3) {
						throw new Error("Password must be at least 3 characters")
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
						.update(credentials.password + config.nextauth_secret)
						.digest("hex")

					if (credentials.signingIn === "true") {
						if (
							user?.password &&
							crypto.timingSafeEqual(
								Buffer.from(user.password),
								Buffer.from(hashedPassword)
							)
						) {
							return user
						} else {
							throw new Error("Incorrect username or password")
						}
					} else {
						if (config.registration_password) {
							if (!credentials.registration_password) {
								throw new Error("Missing registration password")
							}

							if (
								credentials.registration_password !==
								config.registration_password
							) {
								throw new Error("Incorrect registration password")
							}
						}

						if (user) {
							throw new Error("Username already taken")
						}

						const newUser = await prisma.user.create({
							data: {
								username: credentials.username,
								displayName: credentials.username,
								role: "user",
								password: hashedPassword,
								name: credentials.username
							}
						})

						return newUser
					}
				}
			})
		)
	}

	return providers
}

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma),
	session: {
		strategy: "jwt"
	},
	pages: {
		signIn: "/signin",
		error: "/signin"
	},
	providers: providers(),
	events: {
		createUser: async ({ user }) => {
			const totalUsers = await prisma.user.count()
			if (config.enable_admin && totalUsers === 1) {
				await prisma.user.update({
					where: {
						id: user.id,
					},
					data: {
						role: "admin"
					}
				})
			}

			if (!user.username) {
				await prisma.user.update({
					where: {
						id: user.id
					},
					data: {
						username: user.name,
						displayName: user.name,
					}
				})
			}
		}
	},
	callbacks: {
		async session({ token, session }) {
			if (token) {
				session.user.id = token.id
				session.user.name = token.name
				session.user.email = token.email
				session.user.image = token.picture
				session.user.role = token.role
				session.user.sessionToken = token.sessionToken
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
				username: dbUser.username,
				sessionToken: token.sessionToken
			}
		}
	}
} as const
