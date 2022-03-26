import { Button, Text, Fieldset } from '@geist-ui/core'

const Settings = () => {

    return (
        <div>
            <Text h1>Settings</Text>

            <Fieldset>
                <Fieldset.Title>Custom Theme</Fieldset.Title>
                <Fieldset.Subtitle>
                    Drift currently supports theming by overriding CSS variables.
                </Fieldset.Subtitle>
                <Fieldset.Footer>
                    {/* <Button auto scale={1 / 3} font="12px">OK</Button> */}
                </Fieldset.Footer>
            </Fieldset>


        </div>
    )
}

export default Settings