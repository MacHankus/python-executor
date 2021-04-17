import React from 'react'
import {errorsExamples} from '../../../../utils/mock/fakeData'
import fakeFetch from '../../../../utils/mock/fakeFetch'
import ResourceLoader from '../../Utils/ResourceLoader'
import SimpleTable from '../SimpleTable'
import {Box} from '@material-ui/core'
import grey from '@material-ui/core/colors/grey'
import {processErrorResource} from '../../../../utils/resource/collection'

const headers = [
    'id' ,
    'run_id',
    'subject',
    'id_subject' ,
    'create_date' ,
    'start_date' ,
    'end_date' ,
    'error_msg' 
]

export default function ProjectTableTasks({id}:{id:number}): JSX.Element {
    return <React.Fragment>
        <ResourceLoader 
        resource={fetch(
            processErrorResource(id),
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                mode:'cors'
            }
        )}
        render={({errors}:{errors:object[]})=>{
            return (<Box mb={2}>
                <SimpleTable options={{thBackground:grey[200],trBackground:grey[100]}} small headers={headers} rows={errors}/>
            </Box>)
        }}/>
    </React.Fragment>
}