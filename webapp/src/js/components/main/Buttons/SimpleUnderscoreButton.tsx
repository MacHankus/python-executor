import React from 'react'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import posed from 'react-pose';
import grey from '@material-ui/core/colors/grey'


type SimpleUnderscoreButtonProps = {
    size?: string
    variant?: string,
    selfManage?: boolean,
    clicked?: boolean,
    onClick?:React.MouseEventHandler<HTMLButtonElement>,
    color?:string,
    animate?: boolean
}

const buttonStyle = {
    padding:'8px 16px 8px 16px',
    position:'relative',
    '&:hover': {
        cursor: 'pointer'
    }
}
const useStylesSmall = makeStyles((theme)=>{ 
    return {
    text: {
        fontSize: '0.7rem'
    },
    button: buttonStyle
}})
const useStylesMedium = makeStyles((theme)=>{ 
    return {
    text: {
        fontSize: '0.810rem'
    },
    button: buttonStyle
}})
const useStylesBig = makeStyles((theme)=>{ 
    return {
    text: {
        fontSize: '0.875rem'
    },
    button: buttonStyle
}})
const lineHeight = 2
const useStyles = makeStyles({
    fromRight:{
        bottom:0,
        right:0,
        height:lineHeight,
        position:'absolute',
        background:grey[700],
    },
    fromLeft:{
        bottom:0,
        left:0,
        height:lineHeight,
        position:'absolute',
        background:grey[700],
    },
    fromCenter:{
        bottom:0,
        left:'50%',
        transform:'translate(-50%,-50%)',
        height:lineHeight,
        position:'absolute',
        background:grey[700],
    },
})
const startPosition = {
    width:'0%',
    transition: { duration: 300 }
}

const LineAnimation = posed.span({
    startPosition:startPosition,
    clickedPosition: { 
        width: '100%' ,
        transition: ({animate})=>({ duration: animate ? 300 : 0 })
    },
})
const SimpleUnderscoreButton:React.FC<SimpleUnderscoreButtonProps> = ({ 
    size = "small", 
    variant = "fromCenter", 
    children ,
    selfManage = true ,
    clicked,
    onClick,
    animate = true
}) => {
    const [selfClicked , setSelfClicked] = React.useState(false)
    const classesRange = {
        small: useStylesSmall(),
        medium: useStylesMedium(),
        big: useStylesBig()
    }
    const classes = useStyles()
    const onClickSelfManage:React.MouseEventHandler<HTMLButtonElement> = ()=>{
        setSelfClicked(!selfClicked);
    }

    const checkClicked = selfManage ? selfClicked : clicked
    const poseName = checkClicked ? 'clickedPosition'  : 'startPosition'
    return (
        <button 
            className={classesRange[size].button} 
            onClick={selfManage ? onClickSelfManage : onClick}>
            <span className={classesRange[size].text}>{children}</span>
            <LineAnimation className={classes[variant]} pose={poseName} animate={animate}/>
        </button >
    )
}

export default SimpleUnderscoreButton