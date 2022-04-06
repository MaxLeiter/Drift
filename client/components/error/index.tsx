import { Page } from '@geist-ui/core'

const Error = ({ status }: {
    status: number
}) => {
    return (
        <Page title={status.toString() || 'Error'}>
            {status === 404 ? (
                <h1>This page cannot be found.</h1>
            ) : (
                <section>
                    <p>An error occurred: {status}</p>
                </section>
            )}
        </Page>
    )
}

export default Error
