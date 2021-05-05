import React from 'react'

import { DatePicker } from "@material-ui/pickers"
import { Grid, makeStyles } from '@material-ui/core'
import ArrowRightIcon from '@material-ui/icons/ArrowRight'
import moment from 'moment'
import { Moment } from 'moment'
import MomentUtils from '@date-io/moment'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import { ThemeProvider } from "@material-ui/styles"
import { createMuiTheme } from "@material-ui/core"
import InputAdornment from '@material-ui/core/InputAdornment'
import UppercaseText from '../TextEffects/UppercaseText'
import { DatePickerProps } from '@material-ui/pickers'

type DateRangePickerInputProps = {
    onChange?: (dateFrom: Moment, dateTo: Moment) => void
}
const newMaterialTheme = createMuiTheme({
    overrides: {
        MuiInput: {
        }
    },
})
const useStyles = makeStyles((theme) => ({
    rootDiv:{
        position:'relative'
    }
}))
const DateRangePickerInput = function ({ onChange, ...props }: DatePickerInputProps & DatePickerProps) {
    const [dateTo, setDateTo] = React.useState<Moment>(moment())
    const [dateFrom, setDateFrom] = React.useState<Moment>(moment().add(-5, 'days'))
    const dateChangeHandle = function (what: 'to' | 'from'): (date: Moment) => void {
        const setDate = {
            to: setDateTo,
            from: setDateFrom
        }
        return (date: Moment) => { setDate[what](date) }
    }
    React.useEffect(() => {
        if (onChange) onChange(dateTo, dateFrom)
    }, [dateTo, dateFrom])
    const classes = useStyles()
    return (
        <div className={classes.rootDiv}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
                <ThemeProvider theme={newMaterialTheme}>
                    <Grid container direction="row" alignItems="center" justify="center" spacing={2}>
                        <Grid item><UppercaseText>from</UppercaseText></Grid>
                        <Grid item>
                            <DatePicker
                                variant="inline"
                                format="yyyy-MM-DD"
                                value={dateFrom}
                                onChange={dateChangeHandle('from')}
                            />
                        </Grid>
                        <Grid item><UppercaseText>to</UppercaseText></Grid>
                        <Grid item>
                            <DatePicker
                                variant="inline"
                                value={dateTo}
                                format="yyyy-MM-DD"
                                onChange={dateChangeHandle('to')}
                            />
                        </Grid>
                    </Grid>
                </ThemeProvider>
            </MuiPickersUtilsProvider>
        </div>
    )
}
/*
 <Grid container direction="row" alignItems="center" justify="center">
                    <Grid item>
                        <DatePicker
                            variant="inline"
                            format="yyyy-MM-DD"
                            value={dateFrom}
                            onChange={dateChangeHandle('from')}
                        />
                    </Grid>
                    <Grid item>
                        <DatePicker
                            variant="inline"
                            value={dateTo}
                            format="yyyy-MM-DD"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <ArrowRightIcon />
                                    </InputAdornment>
                                ),
                            }}
                            onChange={dateChangeHandle('to')}
                        />
                    </Grid>
                </Grid>
*/
export default DateRangePickerInput