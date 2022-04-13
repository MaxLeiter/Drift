import { CssBaseline } from "@geist-ui/core"
import Document, {
	Html,
	Head,
	Main,
	NextScript,
	DocumentContext
} from "next/document"

class MyDocument extends Document {
	static async getInitialProps(ctx: DocumentContext) {
		const initialProps = await Document.getInitialProps(ctx)
		const styles = CssBaseline.flush()

		return {
			...initialProps,
			styles: (
				<>
					{initialProps.styles}
					{styles}
				</> // TODO: Investigate typescript
			) as any
		}
	}

	render() {
		return (
			<Html lang="en">
				<Head />
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}

export default MyDocument
