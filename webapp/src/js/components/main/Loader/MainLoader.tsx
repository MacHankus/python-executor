import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Grid,Box } from '@material-ui/core';
import grey from '@material-ui/core/colors/grey'

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'fixed',
        width: '100%',
        height: '100%',
        zIndex: 10000
    },
    spinner: {
        left:'50%',
        top:'50%',
        transform:'translate(-50%, -50%)',
        position: 'absolute',
        zIndex:10000
    },
    fakeBackground: {
        background: grey[50],
        opacity: '0.4',
        width: '100%',
        height: '100%'
    },
    rootGrid: {
        height: '100%',
        width: '100%',
        position: 'relative',
    },
    bottom: {
        color: theme.palette.grey[400],
        position: 'absolute',
    },
    top: {
        color: '#1a90ff',
        animationDuration: '550ms',

    },
    circle: {
        strokeLinecap: 'round',
    },
}));

export default function MainLoader() {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Box className={classes.fakeBackground} />
            <Box className={classes.spinner}>
                <CircularProgress
                    variant="determinate"
                    className={classes.bottom}
                    size={40}
                    thickness={4}
                    //{...props}
                    value={100}
                />
                <CircularProgress
                    variant="indeterminate"
                    disableShrink
                    className={classes.top}
                    classes={{
                        circle: classes.circle,
                    }}
                    size={40}
                    thickness={4}
                //{...props}
                />
            </Box>
        </div>
    );
}

