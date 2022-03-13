import { Page } from "@geist-ui/core";
import Auth from "@components/auth";
import Header from "@components/header";
import PageSeo from '@components/page-seo';
import { ThemeProps } from "./_app";

const SignUp = ({ theme, changeTheme }: ThemeProps) => (
    <Page width="100%">
        <PageSeo title="Drift - Sign Up" />

        <Page.Header>
            <Header theme={theme} changeTheme={changeTheme} />
        </Page.Header>
        <Page.Content width={"var(--main-content-width)"} paddingTop={"var(--gap)"} margin="auto">
            <Auth page="signup" />
        </Page.Content>
    </Page>
)

export default SignUp
