import { Badge, Tooltip } from "@geist-ui/core";
import { timeUntil } from "@lib/time-ago";
import { useCallback, useEffect, useMemo, useState } from "react";

const ExpirationBadge = ({
    postExpirationDate,
    // onExpires
}: {
    postExpirationDate: Date | string | null
    onExpires?: () => void
}) => {
    const expirationDate = useMemo(() => postExpirationDate ? new Date(postExpirationDate) : null, [postExpirationDate])
    const [timeUntilString, setTimeUntil] = useState<string | null>(expirationDate ? timeUntil(expirationDate) : null);

    useEffect(() => {
        let interval: NodeJS.Timer | null = null;
        if (expirationDate) {
            interval = setInterval(() => {
                if (expirationDate) {
                    setTimeUntil(timeUntil(expirationDate))
                }
            }, 1000)
        }

        return () => {
            if (interval) {
                clearInterval(interval)
            }
        }
    }, [expirationDate])

    const isExpired = useMemo(() => {
        return timeUntilString && timeUntilString === "in 0 seconds"
    }, [timeUntilString])

    // useEffect(() => {
    //     // check if expired every 
    //     if (isExpired) {
    //         if (onExpires) {
    //             onExpires();
    //         }
    //     }
    // }, [isExpired, onExpires])

    if (!expirationDate) {
        return null;
    }

    return (
        <Badge type={isExpired ? "error" : "warning"}>
            <Tooltip
                hideArrow
                text={`${expirationDate.toLocaleDateString()} ${expirationDate.toLocaleTimeString()}`}>
                {isExpired ? "Expired" : `Expires ${timeUntilString}`}
            </Tooltip>
        </Badge>
    )
}

export default ExpirationBadge