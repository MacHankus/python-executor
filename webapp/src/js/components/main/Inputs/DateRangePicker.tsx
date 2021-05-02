import React from 'react'
import { DatePicker, KeyboardDatePicker } from "@material-ui/pickers";
import { Grid } from '@material-ui/core'
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

type DateRangePickerProps = {
    onChange?: (dateFrom: Date, dateTo: Date) => void
}
const DateRangePicker = function ({ onChange }: DateRangePickerProps) {
    const [dateTo, setDateTo] = React.useState(new Date())
    const [dateFrom, setDateFrom] = React.useState(new Date(dateTo.getFullYear(), dateTo.getMonth(), dateTo.getDate() - 5, dateTo.getHours(), dateTo.getMinutes()))
    const dateChangeHandle = function (what: 'to' | 'from'): React.Dispatch<Date> {
        const setDate = {
            to: setDateTo,
            from: setDateFrom
        }
        return setDate[what]
    }
    React.useEffect(()=>{
        if ( onChange ) return onChange(dateTo,dateFrom)
    },[dateTo,dateFrom])
    return (
        <Grid container direction="row" alignItems="center" justify="center">
            <Grid item>
                <DatePicker
                    variant="inline"
                    label="Calendar"
                    value={dateFrom}
                    onChange={dateChangeHandle('from')}
                />
            </Grid>
            <Grid item>
                <ArrowRightIcon />
            </Grid>
            <Grid item>
                <DatePicker
                    variant="inline"
                    label="Calendar"
                    value={dateTo}
                    onChange={dateChangeHandle('to')}
                />
            </Grid>
        </Grid>
    )
}

export default DateRangePicker