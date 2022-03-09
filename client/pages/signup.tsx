import { Page } from "@geist-ui/core";
import Auth from "../components/auth";
import Header from "../components/header";
import { ThemeProps } from "./_app";

const SignUp = ({ theme, changeTheme }: ThemeProps) => (
    <Page width="100%">
        <Page.Header>
            <Header theme={theme} changeTheme={changeTheme} />
        </Page.Header>
        <Page.Content width={"var(--main-content-width)"} paddingTop={"var(--gap)"} margin="auto">
            <Auth page="signup" />
        </Page.Content>
    </Page>
)

export default SignUp