import { Badge, Page, Text } from "@geist-ui/core";
import { GetServerSidePropsContext } from "next"
import Document from '../../components/document'
import Header from "../../components/header";
import VisibilityBadge from "../../components/visibility-badge";
import { ThemeProps } from "../_app";

type Props = ThemeProps & {
    post: any
}

const Post = ({ post, theme, changeTheme }: Props) => {
    if (!post.files) {
        return <div>No files</div>
    }

    return (
        <Page>
            <Page.Header>
                <Header theme={theme} changeTheme={changeTheme} />
            </Page.Header>
            <Page.Content width={"var(--main-content-width)"} margin="0 auto">
                <Text h2>{post.title} <VisibilityBadge visibility={post.visibility} /></Text>
                {
                    post.files.map(({ id, content, title }: { id: any, content: string, title: string }) => (
                        <Document
                            key={id}
                            content={content}
                            title={title}
                            editable={false}
                        />
                    ))
                }
            </Page.Content>

        </Page >
    )
}

export default Post

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { id } = context.query;
    const response = await fetch(`http://localhost:3000/posts/${id}`);
    const json = await response.json();
    return {
        props: {
            post: json
        },
    }
}
