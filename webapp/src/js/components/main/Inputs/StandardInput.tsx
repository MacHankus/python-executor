import React from 'react'
import { Grid, makeStyles, TextField, TextFieldProps } from '@material-ui/core'

type StandardInputProps = {
    onChange?: (value: number | string | null) => void
}

const useStyles = makeStyles((theme) => ({
    rootDiv: {
        position: 'relative'
    }
}))
const StandardInput = function ({ onChange, ...props }: TextFieldProps & StandardInputProps) {
    const [value, setValue] = React.useState(null)
    React.useEffect(() => {
        if (onChange) onChange(value)
    }, [value])
    const classes = useStyles()
    return (
        <div className={classes.rootDiv}>
            <TextField
                {...props}
            />
        </div>
    )
}

export default DatePickerInput