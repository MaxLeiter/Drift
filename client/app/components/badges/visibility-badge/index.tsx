import type { PostVisibility } from "@lib/types"
import Badge from "../badge"

type CastPostVisibility = PostVisibility | string

type Props = {
	visibility: CastPostVisibility
}

const VisibilityBadge = ({ visibility }: Props) => {
	return <Badge type={"primary"}>{visibility}</Badge>
}

export default VisibilityBadge
