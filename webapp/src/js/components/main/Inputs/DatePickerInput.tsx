import React from 'react'

import { DatePicker } from "@material-ui/pickers"
import { makeStyles } from '@material-ui/core'
import moment from 'moment'
import { Moment } from 'moment'
import MomentUtils from '@date-io/moment'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import { ThemeProvider } from "@material-ui/styles"
import { createMuiTheme } from "@material-ui/core"
import { DatePickerProps } from '@material-ui/pickers'

type DatePickerInputProps = {
    onChange?: (date: Moment) => void
}
const newMaterialTheme = createMuiTheme({
    overrides: {
        MuiInput: {
        }
    },
})
const useStyles = makeStyles((theme) => ({
    rootDiv: {
        position: 'relative'
    }
}))
const DatePickerInput = function ({ onChange, ...props }: DatePickerInputProps & DatePickerProps) {
    const [date, setDate] = React.useState<Moment>(moment())
    React.useEffect(() => {
        if (onChange) onChange(date)
    }, [date])
    const classes = useStyles()
    return (
        <div className={classes.rootDiv}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
                <ThemeProvider theme={newMaterialTheme}>
                    <DatePicker
                        variant="inline"
                        value={date}
                        format="yyyy-MM-DD"
                        onChange={setDate}
                        {...props}
                    />
                </ThemeProvider>
            </MuiPickersUtilsProvider>
        </div>
    )
}

export default DatePickerInput