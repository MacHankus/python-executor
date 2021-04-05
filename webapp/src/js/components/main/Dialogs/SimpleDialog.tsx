import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import Typography from '@material-ui/core/Typography'
import SmallSign from '../TextEffects/SmallSign'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core'
import Divider from '@material-ui/core/Divider'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
type SimpleDialogProps = {
    title?: string,
    open: boolean,
    onClose: Function,
    sign:number
}
const useStyles = makeStyles((theme) => ({
    dialog: {
        padding: theme.spacing(1)
    },
    title:{
        fontSize:'0.8rem'
    }
}))
const SimpleDialog: React.FC<SimpleDialogProps> = ({ onClose, title, open, children,sign }) => {
    const classes = useStyles()
    return (
        <Dialog onClose={onClose} aria-labelledby="simple-dialog-title" open={open} className={classes.dialog}>
            <DialogTitle >
                <Grid container alignItems="center" justify="flex-start" spacing={2}>
                    <Grid item>
                        <SmallSign>
                            {sign}
                    </SmallSign>
                    </Grid>
                    <Grid item>
                        <Typography id="simple-dialog-title" className={classes.title} >
                            {title}
                        </Typography>
                    </Grid>
                </Grid>
            </DialogTitle>
            <Divider />
            <DialogContent>
                <DialogContentText>
                    {children}
                </DialogContentText>
            </DialogContent>
        </Dialog>
    )
}

export default SimpleDialog