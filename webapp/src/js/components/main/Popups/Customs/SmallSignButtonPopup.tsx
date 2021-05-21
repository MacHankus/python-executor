import React from 'react'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import PopupButton from '../PopupButton'
import SmallSignButton from '../../Buttons/SmallSignButton'
import {EqualityOperatorInterface} from '../../../../utils/resource/filterUrlParser'
import SimpleUnderscoreButton from '../../Buttons/SimpleUnderscoreButton'
import { Grid, makeStyles } from '@material-ui/core'
import clsx from 'clsx'
import { Divider } from '@material-ui/core'
import SmallSign from '../../TextEffects/SmallSign'

const useStyles = makeStyles((theme)=>({
    leftTabsContainer:{
        width:'auto',
        '&:first-child':{
            marginTop:theme.spacing(2)
        }
    },
    descriptionContainer:{
        position:'relative',
        width:'300px'
    },
    description:{
        top:0,
        left:0,
    },
    header:{
        marginBottom:theme.spacing(2)
    }
 }))



type SmallSignButtonPopupType = {
    buttonText: string ,
    equalityList: Array<EqualityOperatorInterface>,
    //function to set index of given item from equalityList
    onSelectItem(index: number): void
}

const SmallSignButtonPopup =  function({buttonText, equalityList, onSelectItem}:SmallSignButtonPopupType) {
    const [indexView, setIndexView] = React.useState<number>(0)
    const [inputValue, setInputValue] = React.useState<string>("")
    const classes = useStyles()
    const ButtComp = <SmallSignButton SmallSignProps={{color:'grey'}}>{buttonText}</SmallSignButton>
    const changeIndexView = (index: number)=>{
        setIndexView(index)
    }
    const handleOnIndexChage = (index: number)=>()=>{
        onSelectItem(index)
    }
    const PopComp = <Box p={2}>
        <Box>
            <Typography className={classes.header}>Comparator definitions</Typography>
        </Box>
        <Box>
            <Grid container direction="row">
                <Grid className={classes.leftTabsContainer} container item justify="flex-start" direction="column" alignItems="stretch">
                    {equalityList.map((item,index)=>(
                        <SimpleUnderscoreButton key={item.representation} variant="fromLeft" selfManage={false} clicked={index === indexView} onClick={(e,state,props,children)=>changeIndexView(index)}> {item.representation} </SimpleUnderscoreButton>
                    ))}
                </Grid>
                <Divider orientation="vertical" flexItem/>
                <Grid className={classes.descriptionContainer} item >
                    {equalityList.map((item,index)=>{
                        if (index === indexView){
                            return (<Box p={2} className={clsx({[classes.description]:true})} key={index}>
                                    <Box mb={2}>
                                        {"means : "}
                                        <SmallSign color="grey">
                                            {item.operator}
                                        </SmallSign>
                                    </Box>
                                    <Typography component="div">{item.description}</Typography>
                                    <Box pt={2} display="flex" alignContent="flex-end" justifyContent="flex-end">
                                        <Button color="primary" variant="outlined" onClick={handleOnIndexChage(index)}>
                                            Select
                                        </Button>
                                    </Box>
                                </Box>)
                        }
                    })}
                </Grid>
            </Grid>
        </Box>
    </Box>
    return (
        <PopupButton ButtonComponent={ButtComp} PopupComponent={PopComp}/>
    );
}

export default SmallSignButtonPopup
