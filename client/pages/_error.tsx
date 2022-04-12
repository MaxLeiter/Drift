import ErrorComponent from "@components/error"

function Error({ statusCode }: { statusCode: number }) {
	return <ErrorComponent status={statusCode} />
}

Error.getInitialProps = ({ res, err }: { res: any; err: any }) => {
	const statusCode = res ? res.statusCode : err ? err.statusCode : 404
	return { statusCode }
}

export default Error
