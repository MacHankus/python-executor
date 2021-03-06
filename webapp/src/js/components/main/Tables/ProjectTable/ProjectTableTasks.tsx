import React from 'react'
import ResourceLoader from '../../Utils/ResourceLoader'
import {tasksExamples} from '../../../../utils/mock/fakeData'
import fakeFetch from '../../../../utils/mock/fakeFetch'
import SimpleTable from '../SimpleTable'
import { Typography } from '@material-ui/core'
import {Box} from '@material-ui/core'
import grey from '@material-ui/core/colors/grey'
import {processTaskResource} from '../../../../utils/resource/collection'

export default function ProjectTableTasks({id}:{id:number}): JSX.Element {
    return <React.Fragment>
        <ResourceLoader 
        resource={fetch(
            processTaskResource(id),
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                mode:'cors'
            }
        )}
        render={({tasks}:{tasks:object})=>{
            return (<Box mb={2}>
                <SimpleTable options={{thBackground:grey[200],trBackground:grey[100]}} small headers={['id','file_path','code','function','arguments']} rows={tasks} columnAsKey={'id'}/>
            </Box>)
        }}/>
    </React.Fragment>
}