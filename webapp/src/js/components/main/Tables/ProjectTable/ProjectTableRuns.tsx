import React from 'react'
import {runsExamples} from '../../../../utils/mock/fakeData'
import fakeFetch from '../../../../utils/mock/fakeFetch'
import ResourceLoader from '../../Utils/ResourceLoader'
import SimpleTable from '../SimpleTable'
import {Box} from '@material-ui/core'
import grey from '@material-ui/core/colors/grey'


export default function ProjectTableTasksQueues(props:any): JSX.Element {
    return <React.Fragment>
        <ResourceLoader 
        resource={fakeFetch(1,{runs:runsExamples})}
        render={({runs}:{runs:object})=>{
            return (<Box mb={2}>
                <SimpleTable
                    options={{thBackground:grey[200],trBackground:grey[100]}} 
                    small 
                    headers={['id','id_process','start_date','end_date','success','error_msg']}
                    rows={runs}/>
            </Box>)
        }}/>
    </React.Fragment>
}