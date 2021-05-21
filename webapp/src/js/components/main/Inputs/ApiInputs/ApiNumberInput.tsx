import React from 'react'
import { EqualityOperatorManagerInterface } from '../../../../utils/resource/filterUrlParser'
import EqualityOperatorManager from '../../../../utils/resource/filterUrlParser'
import StandardInput from '../../../../components/main/Inputs/StandardInput'
import UppercaseText from '../../TextEffects/UppercaseText'
import { Grid, Menu, MenuItem, Tooltip, Popper, TextField, makeStyles } from '@material-ui/core'
import SmallSignButton from '../../Buttons/SmallSignButton'
import SmallSignButtonPopup from '../../Popups/Customs/SmallSignButtonPopup'
import { ApiInputCommonProps, ApiInputCommonSate } from './Common'
import { ApiInputAbstract } from './ApiInputAbstract'
import { withStyles } from '@material-ui/core'
import { WithStyles } from '@material-ui/core'
import { createStyles } from '@material-ui/core'

// const useStyles = makeStyles((theme)=>({
//     visibleName:{
//         fontSize:'0.8rem'
//     }
// }))

// interface ApiTextInputProps extends ApiInputCommonProps {
// }
// const eom: EqualityOperatorManagerInterface = new EqualityOperatorManager()
// const ApiTextInput = function ({ onChange,name, visibleName }: ApiTextInputProps) {
//     const [ managerIndex, setManagerIndex ] = React.useState<number>(0)
//     const [ value, setValue ] = React.useState<string>("")
//     const classes = useStyles()
//     const equalityList = [
//         eom.like(),
//         eom.eq()
//     ]
//     const handleOnManagerIndexChange = (index: number)=>{
//         if (index !== managerIndex){
//             setManagerIndex(index)
//             if (onChange) onChange(name,equalityList[index].buildFrom(name,value))
//         } 
//     }
//     const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
//         const target = e.target
//         const value = target.value
//         if (onChange) onChange(name,equalityList[managerIndex].buildFrom(name,value))
//         setValue(value)
//     }
//     return (
//         <div >

//             <Grid container justify="center" alignItems="center" spacing={1}>
//                 <Grid item>
//                     <UppercaseText className={classes.visibleName}>
//                         {visibleName}
//                     </UppercaseText>
//                 </Grid>
//                 <Grid item>
//                     <SmallSignButtonPopup buttonText={equalityList[managerIndex].representation} equalityList={equalityList} onSelectItem={handleOnManagerIndexChange}/>
//                     {/*<SmallSignButton SmallSignProps={{color:"grey"}} onClick={handleMenuClick} onMouseEnter={handleOnMouseEnter} onMouseLeave={handleOnMouseLeave}> {equalityList[managerIndex].representation} </SmallSignButton>*/}
//                 </Grid>
//                 <Grid item>
//                     <TextField name={name} onChange={handleOnChange}/>
//                 </Grid>
//             </Grid>
//         </div>
//     )
// }

// export default ApiTextInput



const styles = createStyles({
    visibleName: {
        fontSize: '0.8rem'
    }
})
//export default ApiTextInput
const eom: EqualityOperatorManagerInterface = new EqualityOperatorManager()
class ApiNumberInput extends ApiInputAbstract<WithStyles<typeof styles>, {}>{
    equalityList = [
        eom.gt(),
        eom.gte(),
        eom.lt(),
        eom.lte(),
        eom.eq()
    ]
    render() {
        const classes = this.props.classes
        const { name,visibleName, ...props} = this.props
        return (
            <div>
                <Grid container justify="center" alignItems="center" spacing={1}>
                    <Grid item>
                        <UppercaseText className={classes.visibleName}>
                            {this.props.visibleName}
                        </UppercaseText>
                    </Grid>
                    <Grid item>
                        <SmallSignButtonPopup buttonText={this.equalityList[this.state.managerIndex].representation} equalityList={this.equalityList} onSelectItem={this.handleOnManagerIndexChange} />
                    </Grid>
                    <Grid item>
                        <TextField error={this.state.error} helperText={this.state.errorMsg} name={name} onChange={this.handleOnChange}/>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default withStyles(styles)(ApiNumberInput);
