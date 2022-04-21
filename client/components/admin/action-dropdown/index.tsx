import { Popover, Button } from "@geist-ui/core"
import { MoreVertical } from "@geist-ui/icons"

type Action = {
    title: string
    onClick: () => void
}

const ActionDropdown = ({
    title = "Actions",
    actions,
    showTitle = false,
}: {
    title?: string,
    showTitle?: boolean,
    actions: Action[]
}) => {
    return (
        <Popover
            title={title}
            content={
                <>
                    {showTitle && <Popover.Item title>
                        {title}
                    </Popover.Item>}
                    {actions.map(action => (
                        <Popover.Item
                            onClick={action.onClick}
                            key={action.title}
                        >
                            {action.title}
                        </Popover.Item>
                    ))}
                </>
            }
            hideArrow
        >
            <Button iconRight={<MoreVertical />} auto></Button>
        </Popover>
    )
}

export default ActionDropdown