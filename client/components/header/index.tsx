import { Page, ButtonGroup, Button } from "@geist-ui/core";
import { Moon, Sun } from "@geist-ui/icons";
import { DriftProps } from "../../pages/_app";
import ShiftBy from "../shift-by";
import Link from '../Link'

const Header = ({ theme, changeTheme }: DriftProps) => {
    return (
        <Page.Header height={'40px'} margin={0} paddingBottom={0} paddingTop={"var(--gap)"} >
            <ButtonGroup>
                <Button onClick={() => {
                    localStorage.clear();
                }}><Link href="/signin">Sign out</Link></Button>
                <Button>
                    {/* TODO: Link outside Button, but seems to break ButtonGroup */}
                    <Link href="/mine">
                        Yours
                    </Link>
                </Button>
                <Button>
                    {/* TODO: Link outside Button, but seems to break ButtonGroup */}
                    <Link href="/new">
                        New
                    </Link>
                </Button>
                <Button onClick={() => changeTheme()}>
                    <ShiftBy y={6}>{theme === 'light' ? <Moon /> : <Sun />}</ShiftBy>
                </Button>
            </ButtonGroup>
        </Page.Header >
    )
}

export default Header