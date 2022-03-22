import Page from "@geist-ui/core/dist/page";
import PageSeo from "@components/page-seo";
import Auth from "@components/auth";
import Header from "@components/header";
import type { ThemeProps } from "@lib/types";

const SignIn = ({ theme, changeTheme }: ThemeProps) => (
    <Page width={"100%"}>
        <PageSeo title="Drift - Sign In" />

        <Page.Header>
            <Header theme={theme} changeTheme={changeTheme} />
        </Page.Header>
        <Page.Content paddingTop={"var(--gap)"} width={"var(--main-content-width)"} margin="auto">
            <Auth page="signin" />
        </Page.Content>
    </Page>
)

export default SignIn