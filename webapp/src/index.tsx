import React from "react";
import ReactDOM from "react-dom";
import App from "./js/components/main/App";
import { BrowserRouter as Router} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./js/redux/store/store";
import { createMuiTheme } from '@material-ui/core/styles';

import '../src/scss/main.scss';

const theme = createMuiTheme();


ReactDOM.hydrate(
    <Provider store={store}>
        <Router>
            <App />
        </Router>
    </Provider>,
    document.getElementById('app')
)