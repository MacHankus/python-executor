import React from 'react'
import PropTypes from 'prop-types'
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
import SimpleTable from '../SimpleTable'
import SmallTableCell from '../SmallTableCell'
import ResourceLoader from '../../Utils/ResourceLoader'
import ProjectCollapse from './ProjectCollapse'
import grey from '@material-ui/core/colors/grey'
import { Menu, MenuItem } from '@material-ui/core'
import clsx from 'clsx'
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

const initialStateForMenu = {
    mouseX: null,
    mouseY: null,
  };

const useStyles = makeStyles(theme => ({
    root: {
        '& > *': {
            borderBottom: 'unset',
            whiteSpace: 'nowrap',
        },
        whiteSpace: 'nowrap',
        transition:'0.2s'
    },
    cellForCollapsibleContent: {
        paddingBottom: 0,
        paddingTop: 0,
        border: 'initial'
    },
    collapsibleRow: {
        borderBottom: '1px solid ' + grey[200],
        transition:'0.2s'
    },
    backgroundOpen:{
        background:grey[200]
    }
}));

export default function ProjectCollapsibleRow({ row, headers }: { row: object, headers: string[] }) {
    const [open, setOpen] = React.useState<boolean | null>(false);
    const classes = useStyles();
    const [menuState, setMenuState] = React.useState<{}>(initialStateForMenu)
    const menuClose = () => {
        setMenuState(initialStateForMenu)
    }
    const menuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setMenuState({
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
          })
    };
    console.log(row)
    return (
        <React.Fragment key={row.id}>
            <TableRow key={"stable"} component="tr" hover className={clsx({[classes.root]:true, [classes.backgroundOpen]:open})} onContextMenu={menuOpen}>
                <SmallTableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </SmallTableCell>
                {
                    headers.map((elem) => {

                        return (<SmallTableCell key={elem} cutTextToIndex={10} component="td" scope="row" dialogTitle={`${elem}`} id={row['id']}>{row[elem]}</SmallTableCell>)
                    })
                }

            </TableRow>
            <TableRow key={"collapse"} className={clsx({[classes.collapsibleRow]:true, [classes.backgroundOpen]:open})}>
                <SmallTableCell className={classes.cellForCollapsibleContent} colSpan={headers.length + 1} component="td" scope="row">
                    <ProjectCollapse open={open} id={row.id}/>
                </SmallTableCell>
            </TableRow >
            <Menu
                id={`id-project-table-row-menu-${row.id}`}
                open={menuState.mouseY !== null}
                onClose={menuClose}
                anchorReference="anchorPosition"
                anchorPosition={
                    menuState.mouseY !== null && menuState.mouseX !== null
                    ? { top: menuState.mouseY, left: menuState.mouseX }
                    : undefined
                }
              >
                <MenuItem key={'disable'} onClick={menuClose}>Disable</MenuItem>
                <MenuItem key={'playgroung'} onClick={menuClose}>Playgroung</MenuItem>
            </Menu>
        </React.Fragment >
    );
}