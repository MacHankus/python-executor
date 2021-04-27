import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import ProjectCollapsibleRow from './ProjectCollapsibleRow'
import { withStyles } from '@material-ui/core/styles'
import grey from '@material-ui/core/colors/grey'
import Loader from '../../Loader/Loader'

interface ProjectTableProps {
    headers: string[],
    data: object[],
    loading?: boolean
}
const styles = (theme:any)=>({
    root: {
        maxHeight: '100%'
    },
    theadCell:{
        fontWeight:'bold'
    }
})
function headersMap(header:string): string {
    const map = {
        id:"Id",
        name:'Name',
        description: 'Description',
        last_start_date: 'Last Start',
        last_end_date: 'Last End',
        last_success_date: 'Last Success',
        last_error_date: 'Last Error',
        last_error: 'Last Error Info',
        number_of_queues: 'Number Of Queues',
        number_of_tasks: 'Number Of Tasks'
    }
    if( map[header] ){
        return map[header]
    }
    throw new Error(`There is no header [${header}] defined.`)
}

class ProjectTable extends React.Component<ProjectTableProps, {}> {
    render() {
        const { classes } = this.props
        return (<TableContainer component={Paper} className={classes.root}>
            <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow >
                        <TableCell/>
                        {
                            this.props.headers.map((elem) => (<TableCell key={elem} className={classes.theadCell}>{headersMap(elem)}</TableCell>))
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    
                    {
                        this.props.data && this.props.data.map((row: object) => (
                            <ProjectCollapsibleRow key={row.id} row={row} headers={this.props.headers} />
                        ))
                    }
                    {this.props.loading && <TableRow>
                        <TableCell colSpan={this.props.headers.length + 1}>
                            <Loader/>
                        </TableCell>
                    </TableRow>}
                </TableBody>
            </Table>
        </TableContainer>)
    }
}
const ProjectTable_styled = withStyles(styles)(ProjectTable)
export default ProjectTable_styled