import React from 'react'
import {errorsExamples} from '../../../../utils/mock/fakeData'
import fakeFetch from '../../../../utils/mock/fakeFetch'
import ResourceLoader from '../../Utils/ResourceLoader'
import SimpleTable from '../SimpleTable'
import {Box} from '@material-ui/core'
import grey from '@material-ui/core/colors/grey'


export default function ProjectTableTasksQueues(props:any): JSX.Element {
    return <React.Fragment>
        <ResourceLoader 
        resource={fakeFetch(1,{errors:errorsExamples})}
        render={({errors}:{errors:object})=>{
            return (<Box mb={2}>
                <SimpleTable options={{thBackground:grey[200],trBackground:grey[100]}} small headers={['id', 'occur_date', 'traceback', 'task_id']} rows={errors}/>
            </Box>)
        }}/>
    </React.Fragment>
}