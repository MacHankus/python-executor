import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import grey from '@material-ui/core/colors/grey'

type SmallSignProps = {
    variant?: string,
    color?: string
}
const useStyles = makeStyles((theme) => ({
    root: {
        borderRadius: '2px',
        color:'white',
        padding:'3px 6px 3px 6px',
        display:'block'
    }
}))
const SmallSign: React.FC<SmallSignProps> = ({
    variant = 'simple',
    color,
    children,
    ...props
}) => {
    const classes = useStyles()
    return (
        <Typography variant="caption" {...props} className={classes.root} style={{ background: color || grey[800] }}>
            {children}
        </Typography>
    )
}


export default SmallSign