import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import InboxIcon from '@material-ui/icons/MoveToInbox'
import MailIcon from '@material-ui/icons/Mail'
import SimpleUnderscoreButton from '../Buttons/SimpleUnderscoreButton'
import Grid from '@material-ui/core/Grid'
import EmojiObjectsIcon from '@material-ui/icons/EmojiObjects'
import TimelineIcon from '@material-ui/icons/Timeline'
import {readStorage, writeStorage} from '../../../utils/storage'

type LeftDrawerProps = {
  open: boolean,
  toggleDrawer: Function
}

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
});

export default function LeftDrawer(props: LeftDrawerProps) {
  const classes = useStyles()
  const initPosition = readStorage('preferences','drawerPosition')
  const [position, setPosition] = React.useState(initPosition ? initPosition : 'left')
  const { toggleDrawer, open } = props
  const changePosition = (position) => () => {
    writeStorage('preferences','drawerPosition',position)
    setPosition(position)
  }
  const list = (position) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: position === 'top' || position === 'bottom',
      })}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {[{name:'Process',icon:EmojiObjectsIcon}].map((object, index) => (
          <ListItem button key={object.name}>
            <ListItemIcon> {<object.icon/>} </ListItemIcon>
            <ListItemText primary={object.name} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {[{name:'Statistics',icon:TimelineIcon}].map((object, index) => (
          <ListItem button key={object.name}>
            <ListItemIcon>{<object.icon/>}</ListItemIcon>
            <ListItemText primary={object.name} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <div>
      <React.Fragment key={position}>
        <SwipeableDrawer
          anchor={position}
          open={open}
          onClose={toggleDrawer(false)}
          onOpen={toggleDrawer(true)}
        >
          <Grid container >
            {['left', 'right', 'top', 'bottom'].map((p) => {
              return <Grid >
                <SimpleUnderscoreButton 
                  variant="fromRight" 
                  key={p} 
                  selfManage={false} 
                  animate={false}
                  onClick={changePosition(p)} 
                  clicked={position === p }>
                  {p}
                </SimpleUnderscoreButton>
              </Grid>
            })}
          </Grid>
          {list(position)}
        </SwipeableDrawer>
      </React.Fragment>
    </div>
  );
}
