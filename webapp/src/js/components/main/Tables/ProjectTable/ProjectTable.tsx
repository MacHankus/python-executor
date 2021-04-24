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
import { processStatsResource } from '../../../../utils/resource/collection'

interface ProjectTableProps {
    headers: string[],
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
                            this.props.headers.map((elem) => (<TableCell size="small" key={elem}>{elem}</TableCell>))
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    <ResourceLoader
                        resource={fetch(
                            processStatsResource(),
                            {
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                mode:'cors'
                            }
                        )}
                        render={({process_stats}:{process_stats: object[]} ) => {
                            console.log('process_stats')
                            console.log(process_stats)
                            return process_stats.map((row: object) => (
                                <ProjectCollapsibleRow key={row.id} row={row} headers={this.props.headers} />
                            ))
                        }}
                        errorRender={(err: string) => <TableRow>
                            <TableCell colSpan={this.props.headers.length + 1}>{err}</TableCell>
                        </TableRow>}
                    />
                </TableBody>
            </Table>
        </TableContainer>)
    }
}
const ProjectTable_styled = withStyles(styles)(ProjectTable)
export default ProjectTable_styled