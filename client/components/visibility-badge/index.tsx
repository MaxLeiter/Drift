import { Badge } from "@geist-ui/core"
import { Visibility } from "@lib/types"

type Props = {
    visibility: Visibility
}

const VisibilityBadge = ({ visibility }: Props) => {
    const getBadgeType = () => {
        switch (visibility) {
            case "public":
                return "success"
            case "private":
                return "warning"
            case "unlisted":
                return "default"
        }
    }

    return (<Badge marginLeft={'var(--gap)'} type={getBadgeType()}>{visibility}</Badge>)
}

export default VisibilityBadge
