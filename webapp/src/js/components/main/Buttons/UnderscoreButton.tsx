import React from 'react'
import {Button, makeStyles} from '@material-ui/core'
import clsx from 'clsx'
import posed from 'react-pose'
const useStyles = makeStyles((theme)=>({
    root:{
        padding: theme.spacing(1),
        fontSize:'initial',
        borderRadius:'initial'
    },
    '&:hover':{
        background:'transparent'
    },
    line:{
        height:'3px',
        background:'black',
        bottom:0,
        left:'50%',
        position:'absolute',
        transform:'translate(-50%, 0)'
    }
    
}))
const Line = posed.span({
    clicked:{
        width:'100%'
    },
    default:{
        width:0
    }
})
type UnderscoreButtonProps = {
    onClick?: ()=> void, selfManage?: boolean, active?: boolean 
}
const UnderscoreButton:React.FunctionComponent<UnderscoreButtonProps> = function({selfManage = true, active, children, onClick}){
    const [clicked , setClicked] = React.useState(false)
    const classes = useStyles()
    const handleClicked = ()=>{
        if ( onClick ) onClick()
        setClicked(!clicked)
    }
    let isClicked = null;
    if (!selfManage){
        isClicked = active
    }else{
        isClicked = clicked
    }
    console.log(selfManage, isClicked)
    return <Button disableRipple className={classes.root} onClick={handleClicked}>
        {children}
        <Line className={classes.line} pose={isClicked ? 'clicked' : 'default'}/>
    </Button>
}
export default UnderscoreButton

