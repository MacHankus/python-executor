import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import grey from '@material-ui/core/colors/grey'

type SmallSignProps = {
    variant?: string,
    color?: 'transparent' | 'grey'
}
const useStyles = makeStyles((theme) => ({
    rootTransparent:{
        textTransform:'uppercase',
        fontWeight:'bold',
        borderRadius: '2px',
        color:grey[800] ,
        padding:'3px 6px 3px 6px',
        display:'block',
        background: 'transparent',
        lineHeight:'initial'
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
        <Typography variant="button" {...props} className={ classes.rootTransparent }>
            {children}
        </Typography>
    )
}


export default SmallSign