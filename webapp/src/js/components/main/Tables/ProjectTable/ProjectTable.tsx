import React from 'react';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { projectRouteRowExample } from '../../../../utils/mock/fakeData'
import fakeFetch from '../../../../utils/mock/fakeFetch'
import { arrayFiller } from '../../../../utils/mock/helpers'
import ResourceLoader from '../../Utils/ResourceLoader'
import ProjectCollapsibleRow from './ProjectCollapsibleRow'
import { withStyles } from '@material-ui/core/styles'


interface ProjectTableProps {
    headers: string[],
    rows: object[],
}
const styles = {
    root: {
        maxHeight: '100%'
    }
}
class ProjectTable extends React.Component<ProjectTableProps, {}> {
    render() {
        const { classes } = this.props
        return (<TableContainer component={Paper} className={classes.root}>
            <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell size="small" />
                        {
                            this.props.headers.map((elem) => (<TableCell size="small">{elem}</TableCell>))
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    <ResourceLoader
                        resource={fakeFetch(1, arrayFiller(10, projectRouteRowExample), 'projects_stats')}
                        render={(data: { projects_stats: object[] }) => {
                            let projects_stats: object[] = data.projects_stats
                            return projects_stats.map((row: object) => (
                                <ProjectCollapsibleRow key={row.id} row={row} headers={this.props.headers} />
                            ))
                        }}
                    />

                </TableBody>
            </Table>
        </TableContainer>)
    }
}
const ProjectTable_styled = withStyles(styles)(ProjectTable)
export default ProjectTable_styled