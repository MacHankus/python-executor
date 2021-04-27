import React from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core'
import SmallTableCell from './SmallTableCell'
import grey from '@material-ui/core/colors/grey'

type optionsType = {
    thBackground?: string,
    trBackground?: string
}
type TablePros = {
    small: boolean,
    rows: object[],
    headers: string[],
    options?: optionsType,
    columnAsKey?: string
}
const useStyles = makeStyles({
    root: {
        width: 'auto',
        border:`1px solid ${grey[200]}`
    }
})
export default function SimpleTable({ small, rows, headers, options = {}, columnAsKey }: TablePros) {
    const classes = useStyles()
    return (<Table size="small" aria-label="purchases" className={classes.root}>
        <TableHead>
            <TableRow style={{ background: options.thBackground ? options.thBackground : null }}>
                {
                    headers.map((elem) => {
                        if (small) {
                            return <TableCell key={elem}>{elem}</TableCell>
                        }
                    })
                }
            </TableRow>
        </TableHead>
        <TableBody >
            {rows.map((row, index) => {
                return (<TableRow key={row[columnAsKey]} style={{background:index % 2 > 0 ? options.trBackground : null}}>
                    {
                        headers.map((elem) => {
                            return (<SmallTableCell key={elem} component="td" scope="row" align="right">
                                {row[elem]}
                            </SmallTableCell>)
                        })
                    }
                </TableRow>)
            })}
        </TableBody>
    </Table>)
}