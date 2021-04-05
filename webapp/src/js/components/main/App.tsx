import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import MainBar from './Navigation/MainBar'
import Main from './Main'
import LeftDrawer from './Navigation/LeftDrawer'
import MainContent from './MainContent'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import CssBaseline from "@material-ui/core/CssBaseline"
import { withRouter } from "react-router"
import { connect } from "react-redux"
import { defaultStateInterface } from '../../redux/store/defaultState'

const theme = createMuiTheme();
type AppProps = {
    serverRendered?: any
}

function App(props: AppProps) {
    return <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <React.Fragment>
            <Main/>
        </React.Fragment>
    </MuiThemeProvider>
}


const mapStateToProps = (state: defaultStateInterface) => {return ({ 
    loading: state.loading
})};
const _App = connect(mapStateToProps, null)(App);
const withRouter_App = withRouter(_App);
export default withRouter_App;