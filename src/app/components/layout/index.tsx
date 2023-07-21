"use client"

import clsx from "clsx"
import styles from "./page.module.css"
import Link from "@components/link"

export default function Layout({
	children,
	forSites
}: {
	forSites?: boolean
	children: React.ReactNode
}) {
	return (
		<div className={clsx(styles.page, forSites && styles.forSites)}>
			<div className="flex flex-col justify-between h-screen">
				<div> {children}</div>
				<footer className="mx-auto h-4 max-w-[var(--main-content)] text-center text-sm text-gray-500">
					<p>
						Drift is an open source project by{" "}
						<Link colored href="https://twitter.com/Max_Leiter">
							Max Leiter
						</Link>
						. You can view the source code on{" "}
						<Link colored href="https://github.com/MaxLeiter/Drift">
							GitHub
						</Link>
						.
					</p>
				</footer>
			</div>
		</div>
	)
}
