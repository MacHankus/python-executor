import React from 'react'
import { withStyles, createStyles, Theme, WithStyles } from '@material-ui/core';
import { CollapsibleTable } from './Tables/CollapsibleTable'
import { defaultStateInterface } from '../../redux/store/defaultState'
import { stopLoading } from '../../redux/actions/loadingActions'
import { connect } from 'react-redux'
import ProjectTable from './Tables/ProjectTable/ProjectTable'
const styles = (theme: Theme) => createStyles({
})

interface ProjectProps extends WithStyles<typeof styles> {
    stopLoadingHandle: Function
}
class Projects extends React.Component<ProjectProps, {}> {
    componentDidMount() {
        this.props.stopLoadingHandle()
    }
    render() {
        const classes = this.props.classes
        return (<div id="project-main" className={`main`}>
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
            ]}/>
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