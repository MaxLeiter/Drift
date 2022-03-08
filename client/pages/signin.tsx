import { Page } from "@geist-ui/core";
import Auth from "../components/auth";
import Header from "../components/header";
import { ThemeProps } from "./_app";

const SignIn = ({ theme, changeTheme }: ThemeProps) => (
    <Page>
        <Page.Header>
            <Header theme={theme} changeTheme={changeTheme} />
        </Page.Header>
        <Page.Content width={"var(--main-content-width)"} margin="auto">
            <Auth page="signin" />
        </Page.Content>
    </Page>
)

export default SignIn