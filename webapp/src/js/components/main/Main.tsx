import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Route, Link, Switch } from 'react-router-dom'
import Home from './Home'
import MainBar from './Navigation/MainBar'
import MainLoader from './Loader/MainLoader'
import { defaultStateInterface } from '../../redux/store/defaultState'
import { connect } from 'react-redux'
import Projects from './Projects'

const useStyles = makeStyles(theme => ({
    root: {
        height: '100%',
        width: '100%',
        position: 'relative'
    },
}));
function Main(props) {
    const classes = useStyles()
    const {loading} = props;
    return <React.Fragment>
        {loading.loading ? <MainLoader /> : null}
        <div className={classes.root}>
            <MainBar />
            <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/projects" component={Projects} />
            </Switch>
        </div>
    </React.Fragment>
}


const mapStateToProps = (state: defaultStateInterface) => {
    return ({
        loading: state.loading
    })
};

const _Main = connect(mapStateToProps, null)(Main);
export default _Main;