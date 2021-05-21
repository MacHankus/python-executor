import React from 'react'
import { Button,ExtendButtonBase, ButtonBase, ButtonProps, ButtonBaseTypeMap } from '@material-ui/core'
import SmallSign, {SmallSignProps} from '../TextEffects/SmallSign'

interface SmallSignButtonProps extends ButtonProps {
    SmallSignProps?: SmallSignProps
}

const SmallSignButton:React.FC<SmallSignButtonProps>  = function({SmallSignProps, ...props}){
    return <ButtonBase disableRipple={true} {...props}>
        <SmallSign {...SmallSignProps}>{props.children}</SmallSign>
    </ButtonBase>
}



export default SmallSignButton