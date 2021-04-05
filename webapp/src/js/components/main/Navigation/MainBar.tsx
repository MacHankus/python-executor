import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import grey from '@material-ui/core/colors/grey'
import { Icon, IconButton } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import LeftDrawer from './LeftDrawer'
import { useState } from 'react'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'

const useStyles = makeStyles({
  bar: {
    borderBottom: '1px solid ' + grey[300],
    boxShadow: 'none'
  },
  divider:{
    marginLeft : '5px',
    marginRight:'5px'
  }
})

const MainBar = function (props) {
  const classes = useStyles()
  const [drawerOpenState, setDrawerOpenState] = useState(false)
  const setDrawerOpen = (bool)=>()=>{
    setDrawerOpenState(bool)
  }
  return (<AppBar position="fixed" className={classes.bar} color="default" size="small">
  
    <Toolbar>
      <Grid container alignItems="flex-start" >
        <IconButton onClick={setDrawerOpen(true)}>
          <MenuIcon />
        </IconButton>
        <Divider className={classes.divider} orientation="vertical" flexItem />
      </Grid>
    </Toolbar>

    <LeftDrawer open={drawerOpenState} toggleDrawer={setDrawerOpen}/>

  </AppBar>)
}


export default MainBar