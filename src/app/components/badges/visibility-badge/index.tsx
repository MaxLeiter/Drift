import { Badge } from "../badge"

type Props = {
	visibility: string
}

const VisibilityBadge = ({ visibility }: Props) => {
	return <Badge>{visibility}</Badge>
}

export default VisibilityBadge
