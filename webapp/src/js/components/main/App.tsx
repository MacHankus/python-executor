import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Main from './Main'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import CssBaseline from "@material-ui/core/CssBaseline"
import { withRouter } from "react-router"
import { connect } from "react-redux"
import { defaultStateInterface } from '../../redux/store/defaultState'
import MomentUtils from '@date-io/moment'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
const theme = createMuiTheme();
type AppProps = {
    serverRendered?: any
}

function App(props: AppProps) {
    return <MuiThemeProvider theme={theme}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
            <CssBaseline />
            <React.Fragment>
                <Main />
            </React.Fragment>
        </MuiPickersUtilsProvider>
    </MuiThemeProvider>
}


const mapStateToProps = (state: defaultStateInterface) => {
    return ({
        loading: state.loading
    })
};
const _App = connect(mapStateToProps, null)(App);
const withRouter_App = withRouter(_App);
export default withRouter_App;