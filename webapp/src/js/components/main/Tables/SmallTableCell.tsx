import React from 'react'
import { TableCell } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import SimpleDialog from '../Dialogs/SimpleDialog'
import Box from '@material-ui/core/Box'
import MoreIcon from '@material-ui/icons/More'

type smallTableCellProps = {
    cutTextToIndex?: number,
    dialogTitle?: string
}
const useStyles = makeStyles((theme) => ({
    root: {
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
        paddingTop: theme.spacing(0.7),
        paddingBottom: theme.spacing(0.7)
    }
}))
const SmallTableCell: React.FC<smallTableCellProps> = (props) => {
    const classes = useStyles()
    const [dialogOpen, setDialogOpen] = React.useState(false)
    const [isCutted, setIsCutted] = React.useState(false)
    const setDialogOpenHandle = () => {
        if (isCutted) setDialogOpen(true)
    }
    const setDialogCloseHandle = (target) => {
        setDialogOpen(false)
    }
    return <TableCell size="small"  {...props} className={props.className + " " + classes.root } >
        {React.Children.map(props.children, (child, index) => {
            if (props.cutTextToIndex && typeof child === 'string') {
                if (!isCutted) setIsCutted(true)
                return (<>
                        {<span style={{cursor:isCutted ? 'help' : 'initial'}} onClick={setDialogOpenHandle}>{child.substring(0, props.cutTextToIndex) + "..."}</span>}
                        < SimpleDialog open={dialogOpen} onClose={setDialogCloseHandle} title={props.dialogTitle} sign={props.id} >
                            {props.children}
                        </SimpleDialog>
                    </>
                )
            }
            else {
                return child
            }
        })}
    </TableCell >
}
export default SmallTableCell