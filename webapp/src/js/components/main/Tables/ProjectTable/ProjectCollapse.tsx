import React from 'react'
import { Collapse } from '@material-ui/core'
import SwipeableViews from 'react-swipeable-views'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import TabsContainer from '../../Tabs/TabsContainer'
import SimpleUnderscoreButton from '../../Buttons/SimpleUnderscoreButton'
import ProjectTableTasks from './ProjectTableTasks'
import ProjectTableQueues from './ProjectTableQueues'
import ProjectTableErrors from './ProjectTableErrors'
import ProjectTableRuns from './ProjectTableRuns'
import grey from '@material-ui/core/colors/grey'
import TableRow from '@material-ui/core/TableRow'
import SmallTableCell from '../SmallTableCell'
import Paper from '@material-ui/core/Paper'


const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500,
  },
  content: {
    padding: theme.spacing(1)
  },
  appBar: {
    boxShadow: 'initial'
  },
  collapse:{
    marginBottom:theme.spacing(2),
    display:'inline-block'
  }
}));

type ProjectCollapseProps = {
  open: boolean,
  id:number
}
export default function ProjectCollapse({ open, id }: ProjectCollapseProps) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChangeValue = (newValue) => {
    setValue(newValue);
  };
  const getClickedContent = (id) => {
    if (value === 0) {
      return <ProjectTableTasks id={id}/>
    } else if (value === 1) {
      return <ProjectTableQueues id={id}/>
    }else if (value === 2) {
      return  <ProjectTableErrors id={id}/>
    }else if (value === 3) {
      return  <ProjectTableRuns id={id}/>
    }
  }
  return (<Collapse in={open} timeout="auto" unmountOnExit className={classes.collapse} >
      <Paper elevation={3}>
        <AppBar position="static" color="transparent" className={classes.appBar}>
          <TabsContainer value={value} onChange={handleChangeValue}>
            {
              [{ text: 'task ', id: 'task' }
                , { text: 'queues', id: 'queues' }
                , { text: 'errors', id: 'errors' }
                , { text: 'runs', id: 'runs' }
                , { text: 'stats', id: 'stats' }].map((item, index) => {
                  return <SimpleUnderscoreButton selfManage={false} key={item.id}>{item.text}</SimpleUnderscoreButton>
                })
            }
          </TabsContainer>
        </AppBar>
        <Box className={classes.content}>
          {getClickedContent(id)}
        </Box>
      </Paper>
  </Collapse>
  )
}