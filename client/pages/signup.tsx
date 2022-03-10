import { Page } from "@geist-ui/core";
import Head from "next/head";
import Auth from "../components/auth";
import Header from "../components/header";
import { ThemeProps } from "./_app";

const SignUp = ({ theme, changeTheme }: ThemeProps) => (
    <Page width="100%">
        <Head>
            <title>Drift - Sign Up</title>
            <meta name="description" content="A self-hostable clone of GitHub Gist" />
        </Head>
        <Page.Header>
            <Header theme={theme} changeTheme={changeTheme} />
        </Page.Header>
        <Page.Content width={"var(--main-content-width)"} paddingTop={"var(--gap)"} margin="auto">
            <Auth page="signup" />
        </Page.Content>
    </Page>
)

export default SignUp
