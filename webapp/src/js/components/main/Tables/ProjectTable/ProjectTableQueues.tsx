import React from 'react'
import ResourceLoader from '../../Utils/ResourceLoader'
import {queuesExamples} from '../../../../utils/mock/fakeData'
import fakeFetch from '../../../../utils/mock/fakeFetch'
import SimpleTable from '../SimpleTable'
import { Typography } from '@material-ui/core'
import {Box} from '@material-ui/core'
import grey from '@material-ui/core/colors/grey'
export default function ProjectTableTasksQueues(props:any): JSX.Element {
    return <React.Fragment>
        <ResourceLoader 
        resource={fakeFetch(1,{queues:queuesExamples})}
        render={({queues}:{queues:object})=>{
            return (<Box mb={2}>
                <SimpleTable options={{thBackground:grey[200],trBackground:grey[100]}} small headers={['id', 'name', 'run_order', 'blocking']} rows={queues}/>
            </Box>)
        }}/>
    </React.Fragment>
}