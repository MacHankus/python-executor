import React from 'react'
import { withStyles, createStyles, Theme, WithStyles } from '@material-ui/core';
import { CollapsibleTable } from './Tables/CollapsibleTable'
import { defaultStateInterface } from '../../redux/store/defaultState'
import { stopLoading } from '../../redux/actions/loadingActions'
import { connect } from 'react-redux'
import ProjectTable from './Tables/ProjectTable/ProjectTable'
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import BigTile from './Tiles/BigTile'
import TileContainer from './Tiles/TileContainer'
import BarChartIcon from '@material-ui/icons/BarChart';
import ResourceUsingComponent from './Utils/ResourceUsingComponent'
import TableFilterBar from './Bars/TableFilterBar'

const styles = (theme: Theme) => createStyles({
})

interface ProjectProps extends WithStyles<typeof styles> {
    stopLoadingHandle: Function
}

interface ProcessInterface {
    id : number,
    name : string,
    description: string,
    last_start_date: Date,
    last_end_date: Date,
    last_success_date: Date,
    last_error_date: Date,
    last_error: string,
    number_of_queues: number
    number_of_tasks: number
}


class Projects extends React.Component<ProjectProps, {}> {
    componentDidMount() {
        this.props.stopLoadingHandle()
    }
    render() {
        const classes = this.props.classes
        return (<div id="project-main" className={`main`}>
            <Box display="flex" justifyContent="center" width="100%"  boxSizing my={1}>
                <TileContainer justify="flex-start" spacing={2}>
                    <BigTile title="processes" icon={<BarChartIcon/>}>100</BigTile>
                    <BigTile title="running" icon={<BarChartIcon/>}>64</BigTile>
                    <BigTile title="failed 24h" icon={<BarChartIcon/>}>35</BigTile>
                    <BigTile title="tasks" icon={<BarChartIcon/>}>40</BigTile>
                    <BigTile title="queues" icon={<BarChartIcon/>}>150</BigTile>
                </TileContainer>
            </Box>
            
            <ResourceUsingComponent
                baseUrl="http://localhost:5000/api/processes/stats"
                envelope= "process_stats"
                enableLoader={false}
                lazyLoadId = "lazy-loading-process-table-id"
                render={(data: ProcessInterface[], loading: boolean, setQueryObjectAndLoadNew:Function)=>{
                    return (<Box my={1}>
                        <TableFilterBar reloadQueryPartsAndLoadNewData={setQueryObjectAndLoadNew}/>
                        <ProjectTable  headers={[
                            'id',
                            'name',
                            'description',
                            'last_start_date',
                            'last_end_date',
                            'last_success_date',
                            'last_error_date',
                            'last_error',
                            'number_of_queues',
                            'number_of_tasks',
                        ]} data={data} loading={loading}/>
                        <span id="lazy-loading-process-table-id"></span>
                    </Box>
                    )
                }}
            />
        </div>)
    }

}


const mapDispatchToProps = (dispatch) => {
    return {
        stopLoadingHandle: () => {
            dispatch(stopLoading())
        }
    }
}
const withStyles_Projects = withStyles(styles)(Projects)
const _Projects = connect(null, mapDispatchToProps)(withStyles_Projects);
export default _Projects;