import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'
import { CssBaseline } from '@geist-ui/core'

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
                </>
            )
        }
    }

    render() {
        return (<Html lang="en">
            <Head />
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>)
    }
}

export default MyDocument