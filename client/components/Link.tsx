import { Link as GeistLink, LinkProps } from "@geist-ui/core"
import { useRouter } from "next/router";

const Link = (props: LinkProps) => {
    const { basePath } = useRouter();
    const href = basePath ? `/${basePath}/${props.href}` : props.href;
    return <GeistLink {...props} href={href} />
}

export default Link