import React from 'react'
import { EqualityOperatorManagerInterface } from '../../../utils/resource/filterUrlParser'
import EqualityOperatorManager from '../../../utils/resource/filterUrlParser'
import StandardInput from '../../../components/main/Inputs/StandardInput'
import SmallSign from '../TextEffects/SmallSign'
import UppercaseText from '../TextEffects/UppercaseText'
import { Grid } from '@material-ui/core'

type ApiTextInputProps = {
    onChange?: (value: string) => void,
    name: string
}
const eom: EqualityOperatorManagerInterface = new EqualityOperatorManager()
const ApiTextInput = function ({ onChange,name }: ApiTextInputProps) {
    const [ managerIndex, setManagerIndex ] = React.useState(0)
    const [ anchor, setAnchor ] = React.useState(null)
    const equalityList = [
        eom.like(),
        eom.eq()
    ]
    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
      };
    const handleMenuClose = () => {
        setAnchor(null);
    };
    return (
        <div >
            <Grid container justify="center" alignItems="center">
                <Grid item>
                    <UppercaseText>
                        {name}
                    </UppercaseText>
                </Grid>
                <Grid item>
                    <SmallSign color="grey"> {equalityList[managerIndex].representation} </SmallSign>
                </Grid>
                <Grid item>
                    <StandardInput />
                </Grid>
            </Grid>
            <Menu
                id={"id-apitextinput-" + name}
                anchorEl={anchor}
                keepMounted
                open={open}
                onClose={handleMenuClick}
                PaperProps={{}}
            >
                {equalityList.map((option, index) => (
                    <MenuItem key={option.representation} selected={index === managerIndex} onClick={handleMenuClose}>
                        {option}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    )
}

export default ApiTextInput