import React from 'react'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import posed from 'react-pose';
import grey from '@material-ui/core/colors/grey'


type SimpleUnderscoreButtonProps = {
    size?: "small",
    variant?: "fromCenter",
    selfManage?: boolean,
    clicked?: boolean,
    onClick?: (e:React.MouseEvent<HTMLButtonElement, MouseEvent>,state:{}, props:{}, children: React.ReactNode)=> void,
    color?: string,
    animate?: boolean
}

const buttonStyle = {
    padding: '8px 16px 8px 16px',
    position: 'relative',
    '&:hover': {
        cursor: 'pointer'
    }
}
const useStylesSmall = makeStyles(() => {
    return {
        text: {
            fontSize: '0.7rem'
        },
        button: buttonStyle
    }
})
const useStylesMedium = makeStyles(() => {
    return {
        text: {
            fontSize: '0.810rem'
        },
        button: buttonStyle
    }
})
const useStylesBig = makeStyles(() => {
    return {
        text: {
            fontSize: '0.875rem'
        },
        button: buttonStyle
    }
})
const lineHeight = 2
const useStyles = makeStyles({
    fromRight: {
        bottom: 0,
        right: 0,
        height: lineHeight,
        position: 'absolute',
        background: grey[700],
    },
    fromLeft: {
        bottom: 0,
        left: 0,
        height: lineHeight,
        position: 'absolute',
        background: grey[700],
    },
    fromCenter: {
        bottom: 0,
        left: '50%',
        transform: 'translate(-50%,-50%)',
        height: lineHeight,
        position: 'absolute',
        background: grey[700],
    },
})
const defaultPosition = {
    width: '0%',
    transition: { duration: 300 }
}

const LineAnimation = posed.span({
    default: defaultPosition,
    clicked: {
        width: '100%',
        transition: ({ animate }:{animate:boolean}) => ({ duration: animate ? 300 : 0 })
    },
})

const SimpleUnderscoreButton: React.FC<SimpleUnderscoreButtonProps> = (props) => {
    const {
        size = "small",
        variant = "fromCenter",
        children,
        selfManage = true,
        clicked,
        onClick,
        animate = true
    } = props
    const [selfClicked, setSelfClicked] = React.useState(false)
    const classesRange = {
        small: useStylesSmall(),
        medium: useStylesMedium(),
        big: useStylesBig()
    }
    const classes = useStyles()
    const onClickSelfManage: React.MouseEventHandler<HTMLButtonElement> = () => {
        setSelfClicked(!selfClicked);
    }

    const checkClicked = selfManage ? selfClicked : clicked
    const poseName = checkClicked ? 'clicked' : 'default'
    return (
        <button
            className={classesRange[size].button}
            onClick={selfManage ? onClickSelfManage : (e)=>onClick(e,{selfClicked: selfClicked}, props, children)}>
            <span className={classesRange[size].text}>{children}</span>
            <LineAnimation className={classes[variant]} pose={poseName} animate={animate} />
        </button >
    )
}

export default SimpleUnderscoreButton