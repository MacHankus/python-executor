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

type TableFilterBarProps = {

}

const useStyles = makeStyles((theme) => ({
    signsContainer: {
        width: 'auto'
    },
    container: {
        padding: theme.spacing(2)
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
    searchTextField:{
        width:'300px'
    }
}))

const TableFilterBar = function ({ }: TableFilterBarProps) {
    const [collapse, setCollapse] = React.useState(false)
    const classes = useStyles()
    const handleCollapse = () => {
        setCollapse(!collapse)
    }

    return (
        <Box width="100%" my={1}>
            <Paper >
                <Grid container direction="column">
                    <VisibleBar onCollapseIconClick={handleCollapse}/>
                    <CollapsingBar collapse={collapse} />
                </Grid>
            </Paper>
        </Box>)
}

type VisibleBarProps = {
    onCollapseIconClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>)=>void
}
const VisibleBar = function ({onCollapseIconClick}:VisibleBarProps) {
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
    }
}
const PosedCollapseBox = posed(Box)(collapseProps)

type CollapsingBarProps = {
    collapse: false | true
}

const CollapsingBar: React.FC<CollapsingBarProps> = function ({
    collapse
}) {
    const classes = useStyles()
    return (
        <PosedCollapseBox className={classes.collapseContainer} pose={collapse ? 'collapse' : 'default'} >
            <Grid className={clsx(classes.container)} container item direction="row" justify="flex-end">
                <Grid item>
                    <Button
                        variant="contained"
                        color="default"
                        startIcon={<GetAppIcon />}
                    >
                        Upload
                </Button>
                </Grid>
            </Grid>
        </PosedCollapseBox>
    )
}





export default TableFilterBar