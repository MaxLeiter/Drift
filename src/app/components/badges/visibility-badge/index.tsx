import Badge from "../badge"

type Props = {
	visibility: string
}

const VisibilityBadge = ({ visibility }: Props) => {
	return <Badge type={"primary"}>{visibility}</Badge>
}

export default VisibilityBadge
