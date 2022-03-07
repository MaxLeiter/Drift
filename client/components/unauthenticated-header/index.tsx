import { Page, ButtonGroup, Button } from "@geist-ui/core";
import { Moon, Sun } from "@geist-ui/icons";
import { DriftProps } from "../../pages/_app";
import ShiftBy from "../shift-by";
import Link from '../Link'

const UnauthenticatedHeader = ({ theme, changeTheme }: DriftProps) => {
    return (
        <Page.Header height={'40px'} margin={0} paddingBottom={0} paddingTop={"var(--gap)"} >
            <ButtonGroup>
                <Button><Link href="/signup">Sign up</Link></Button>
                <Button><Link href="/signin">Sign in</Link></Button>
                <Button onClick={() => changeTheme()}>
                    <ShiftBy y={6}>{theme === 'light' ? <Moon /> : <Sun />}</ShiftBy>
                </Button>
            </ButtonGroup>
        </Page.Header >
    )
}

export default UnauthenticatedHeader