import { Provider } from 'react-redux'
import React, { Component } from 'react'
import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom'
import appHistory from '../tools/appHistory'
import MainApp from './core/components/MainApp'
import { ConnectedRouter } from 'react-router-redux'
import store from '../store'

import MuiThemeProvider  from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme     from 'material-ui/styles/theme'
import { muiRequired } from 'material-ui/utils/customPropTypes'
import baseTheme         from './../baseTheme'

class RoutingApp extends Component
{
    constructor(props, context)
    {
        super(props, context);
    }
    render ()
    {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme(baseTheme)}>
                <Provider store={ store }>
                    <ConnectedRouter history={ appHistory }>
                        <Route name='main' path='/' component={ MainApp }>
                        </Route>
                    </ConnectedRouter>
                </Provider>
            </MuiThemeProvider>
            );
    }
}

export default RoutingApp