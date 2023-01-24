/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "@vercel/og"
import { NextRequest } from "next/server"

const WIDTH = 1200
const HEIGHT = 630
function Logo() {
	// from public/assets/logo.svg
	return (
		<svg
			width="72"
			height="72"
			version="1.1"
			viewBox="0 0 19.05 19.05"
			xmlns="http://www.w3.org/2000/svg"
		>
			<defs>
				<clipPath id="clipPath7860">
					<circle cx="115.27" cy="135.33" r="9.1406" />
				</clipPath>
				<clipPath id="clipPath7864">
					<circle cx="115.27" cy="135.33" r="9.1406" />
				</clipPath>
			</defs>
			<g transform="translate(-106.13 -126.19)">
				<rect
					transform="matrix(1.0421 0 0 1.0421 -4.4639 -5.3074)"
					x="106.13"
					y="126.19"
					width="18.281"
					height="18.281"
					clip-path="url(#clipPath7864)"
					fill="#1b1b1b"
				/>
				<g
					transform="matrix(1.0421 0 0 1.0421 -4.4639 -5.3074)"
					clip-path="url(#clipPath7860)"
					stroke-width=".95964"
				>
					<path
						d="m132.15 142c-10.707-9.0354-17.374-8.908-17.374-8.908s2.3881 3.4829 0.94799 7.4545c-1.4401 3.9716-7.6664 7.7467-7.6664 7.7467z"
						fill="#fff"
					/>
					<path
						d="m108.89 148.35s6.2294-3.8135 7.6695-7.7851c1.4401-3.9716-1.7851-7.4745-1.7851-7.4745s1.2204 3.091-1.0184 6.7752c-2.239 3.6841-8.9226 4.9787-8.9226 4.9787z"
						fill="#e7e7e7"
					/>
					<path
						d="m105.93 146.03s6.6058-2.1876 8.8448-5.8717c2.2387-3.6841-5e-3 -7.0674-5e-3 -7.0674s-1.3628 3.2487-4.9368 5.2561-10.125 2.2728-10.125 2.2728z"
						fill="#c6c6c6"
					/>
				</g>
			</g>
		</svg>
	)
}
export default async function handler(req: NextRequest) {
	const url = new URL(req.url)
	const title = url.searchParams.get("title") || "A Drift post"
	const description = url.searchParams.get("description") || ""
	const date = url.searchParams.get("date") || new Date().toISOString()
	const numFiles = url.searchParams.get("numFiles") || "0"

	// ...
	return new ImageResponse(
		(
			<div
				style={{
					display: "flex",
					backgroundColor: "#000",
					color: "white",
					height: "100%",
					width: "100%",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center"
				}}
			>
				<div
					style={{
						display: "flex",
						width: 72,
						height: 72,
						position: "absolute",
						top: 32,
						left: 32
					}}
				>
					<Logo />
				</div>
				<div
					style={{
						display: "flex",
						position: "relative",
						flexDirection: "row",
						width: "100%"
					}}
				>
					<div
						style={{
							display: "flex",
							flex: 1,
							paddingLeft: 32,
							flexDirection: "column",
							maxWidth: WIDTH - 325
						}}
					>
						<h1
							style={{
								margin: 0,
								fontWeight: 800,
								fontSize: 48,
								lineHeight: 1
							}}
						>
							{" "}
							{title}{" "}
						</h1>
						<p
							style={{ margin: 0, fontSize: 32, color: "#888", marginTop: 24 }}
						>
							{" "}
							{description}{" "}
						</p>
						<p
							style={{ margin: 0, fontSize: 22, color: "#888", marginTop: 24 }}
						>
							{numFiles} files posted on {new Date(date).toLocaleDateString()}{" "}
							at {new Date(date).toLocaleTimeString()}
						</p>
					</div>
				</div>
			</div>
		),
		{
			width: WIDTH,
			height: HEIGHT,
			// debug: true
		}
	)
}

export const config = {
	runtime: "edge"
}
