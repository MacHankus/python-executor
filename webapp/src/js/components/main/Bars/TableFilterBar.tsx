import { Paper, Box, Button, Grid, makeStyles } from '@material-ui/core'
import React from 'react'
import GetAppIcon from '@material-ui/icons/GetApp'
import IconButton from '@material-ui/core/IconButton'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'
import SimpleUnderscoreButton from '../Buttons/SimpleUnderscoreButton'
import ButtonGroup from '../Buttons/ButtonGroup'
import Divider from '@material-ui/core/Divider'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import SearchIcon from '@material-ui/icons/Search'
import clsx from 'clsx'
import posed from 'react-pose'
import DateRangePickerInput from '../Inputs/DateRangePickerInput'
import DatePickerInput from '../Inputs/DatePickerInput'
import ApiTextInput from '../Inputs/ApiInputs/ApiTextInput'
import ApiNumberInput from '../Inputs/ApiInputs/ApiNumberInput'
import Validator from '../../../utils/resource/validators'
import FindReplaceIcon from '@material-ui/icons/FindReplace';

type TableFilterBarProps = {
    reloadQueryPartsAndLoadNewData: Function
}

const useStyles = makeStyles((theme) => ({
    signsContainer: {
        width: 'auto'
    },
    container: {
        padding: theme.spacing(2)
    },
    inputContainer:{
        width:'100%'
    },
    nowithContainer: {
        width: 'auto'
    },
    collapseContainer: {
        height: 0,
        overflowY: 'hidden'
    },
    collapse: {
        height: 'auto',
    },
    searchTextField: {
        width: '300px'
    }
}))

const TableFilterBar = function ({ reloadQueryPartsAndLoadNewData }: TableFilterBarProps) {
    const [collapse, setCollapse] = React.useState(false)
    const [inputs, setInputs] = React.useState({})
    const classes = useStyles()
    const handleCollapse = () => {
        setCollapse(!collapse)
    }
    const handleSetInputs = (name: string, query: string | null, value: any, error:boolean)=>{
        setInputs(Object.assign({}, inputs, { [name]: {query, error} }))
    }
    console.log(inputs)
    return (
        <Box width="100%" my={1}>
            <Paper >
                <Grid container direction="column">
                    <VisibleBar onCollapseIconClick={handleCollapse} onApplyFiltersClick={()=>reloadQueryPartsAndLoadNewData(inputs)} update={() => { }} />
                    <CollapsingBar collapse={collapse} update={handleSetInputs} />
                </Grid>
            </Paper>
        </Box>)
}

type VisibleBarProps = {
    onCollapseIconClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
    onApplyFiltersClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
    update: () => void
}
const VisibleBar = function ({ onCollapseIconClick, onApplyFiltersClick }: VisibleBarProps) {
    const classes = useStyles()
    return (
        <Grid className={classes.container} container item direction="row" justify="flex-end" spacing={1}>
            <Grid item>
                <TextField className={classes.searchTextField} id="id-process-textfield" label="search" InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }} />
            </Grid>
            <Grid item>
                <Divider orientation="vertical" />
            </Grid>
            <Grid className={classes.signsContainer} container item direction="row" >
                <ButtonGroup defaultItemClicked={0}>
                    <SimpleUnderscoreButton>20</SimpleUnderscoreButton>
                    <SimpleUnderscoreButton>30</SimpleUnderscoreButton>
                    <SimpleUnderscoreButton>50</SimpleUnderscoreButton>
                </ButtonGroup>
            </Grid>
            <Grid item>
                <Divider orientation="vertical" />
            </Grid>
            <Grid className={classes.nowithContainer} container item alignItems="center">
                <Button
                    variant="contained"
                    color="default"
                    startIcon={<GetAppIcon />}
                >
                    export excel
            </Button>
            </Grid>
            <Grid item>
                <Divider orientation="vertical" />
            </Grid>
            <Grid className={classes.nowithContainer} container item alignItems="center">
                <Button
                    variant="contained"
                    color="default"
                    startIcon={<GetAppIcon />}
                >
                    export csv
            </Button>
            </Grid>
            <Grid item>
                <Divider orientation="vertical" />
            </Grid>
            <Grid className={classes.nowithContainer} container item alignItems="center">
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<FindReplaceIcon />}
                    onClick={onApplyFiltersClick}
                >
                    Apply Filters
            </Button>
            </Grid>
            <Grid item>
                <Divider orientation="vertical" />
            </Grid>
            <Grid className={classes.nowithContainer} container item alignItems="center">
                <IconButton aria-label="delete" size="small" onClick={onCollapseIconClick}>
                    <ArrowDownwardIcon fontSize="inherit" />
                </IconButton>
            </Grid>
        </Grid>
    )
}


const collapseProps = {
    collapse: {
        height: 'auto'
    },
    default: {
        height: 0
    },
    container:{
        margin:'initial'
    }
}
const PosedCollapseBox = posed(Box)(collapseProps)

type CollapsingBarProps = {
    collapse: false | true,
    update: (name:string, query:string | null, value:any, error:boolean) => void
}

const CollapsingBar: React.FC<CollapsingBarProps> = function ({
    collapse, update
}) {
    const classes = useStyles()
    return (
        <PosedCollapseBox className={classes.collapseContainer} pose={collapse ? 'collapse' : 'default'} >
            <Grid className={clsx(classes.inputContainer)} container item direction="row" justify="flex-end" spacing={2}>
                <Grid item>
                    {/* <DateRangePickerInput/> */}
                </Grid>
                <Grid item>
                    <ApiTextInput visibleName={"Description"} name="description" onChange={update} validate={Validator.text.likeStatement.validate} />
                </Grid>
                <Grid item>
                    <ApiTextInput visibleName={"Name"} name="project_name" onChange={update} validate={Validator.text.name.validate}/>
                </Grid>
                <Grid item>
                    <ApiNumberInput visibleName={"Id"} name="id" onChange={update} validate={Validator.number.number.validate}/>
                </Grid>
            </Grid>
        </PosedCollapseBox>
    )
}





export default TableFilterBar