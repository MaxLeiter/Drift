import { Link as GeistLink, LinkProps } from "@geist-ui/core"
import { useRouter } from "next/router";

const Link = (props: LinkProps) => {
    const { basePath } = useRouter();
    const propHrefWithoutLeadingSlash = props.href && props.href.startsWith("/") ? props.href.substr(1) : props.href;
    const href = basePath ? `${basePath}/${propHrefWithoutLeadingSlash}` : props.href;
    console.log(href)
    return <GeistLink {...props} href={href} />
}

export default Link
