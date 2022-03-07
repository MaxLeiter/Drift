import { Link as GeistLink, LinkProps } from "@geist-ui/core"
import { useRouter } from "next/router";

const Link = (props: LinkProps) => {
    const { basePath } = useRouter();

    return <GeistLink {...props} href={`/${basePath}/${props.href}`} />
}

export default Link