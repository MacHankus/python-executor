import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Collapse from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import SimpleTable from './SimpleTable'
import SmallTableCell from './SmallTableCell'


const useStyles = makeStyles(theme=>({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
  collapsibleTableRoot:{
    fontSize:'14px'
  },
  paper:{
    padding:theme.spacing(2)
  },
  header:{
    textTransform:'uppercase'
  }

}));


export function CollapsibleRow({ row, headers, collapsibleObject } : {row:object, headers: string[],collapsibleObject: object }) {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  return (
    <>
      <TableRow className={classes.root}>
        <SmallTableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </SmallTableCell>
        {
          headers.map((elem) => {
            return (<SmallTableCell component="td" scope="row">{row[elem]}</SmallTableCell>)
          })
        }
      </TableRow>
      <TableRow>
        {<SmallTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={headers.length + 1}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            {
              Object.keys(collapsibleObject).map((key: string) => {

                return <Box margin={2} className={classes.collapsibleTableRoot} display="flex">
                  <Paper key={key} className={classes.paper}>
                  <Typography gutterBottom component="div" className={classes.header}>
                    {key}
                  </Typography>
                  <SimpleTable small={true} headers={collapsibleObject[key]} rows={row[key]} />
                  </Paper>
                </Box>
              })
            }
          </Collapse>
          </SmallTableCell>}
          </TableRow>
    </>
  );
}

type CollapsibleTableProps = {
  headers: string[],
  rows?: object[],
  collapsibleObject: object
}
export function CollapsibleTable({ headers, rows, collapsibleObject }: CollapsibleTableProps) {
  console.log(rows)
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell size="small" />
            {
              headers.map((elem) => (<TableCell size="small">{elem}</TableCell>))
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {rows && Array.isArray(rows) && rows.map((row: object) => (
          <CollapsibleRow key={row.id} row={row} headers={headers} collapsibleObject={collapsibleObject} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
