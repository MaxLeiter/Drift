import { Page } from "@geist-ui/core";
import Head from 'next/head'
import Auth from "../components/auth";
import Header from "../components/header";
import { ThemeProps } from "./_app";

const SignIn = ({ theme, changeTheme }: ThemeProps) => (
    <Page width={"100%"}>
        <Head>
            <title>Drift - Sign In</title>
            <meta name="description" content="A self-hostable clone of GitHub Gist" />
        </Head>
        <Page.Header>
            <Header theme={theme} changeTheme={changeTheme} />
        </Page.Header>
        <Page.Content paddingTop={"var(--gap)"} width={"var(--main-content-width)"} margin="auto">
            <Auth page="signin" />
        </Page.Content>
    </Page>
)

export default SignIn