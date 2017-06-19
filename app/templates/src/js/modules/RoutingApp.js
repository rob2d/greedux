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


class RoutingApp extends Component
{
    constructor(props, context)
    {
        super(props, context);
    }
    render ()
    {
        return (
            <Provider store={ store }>
                <ConnectedRouter history={ appHistory }>
                    <Route name='main' path='/' component={ MainApp }>
                    </Route>
                </ConnectedRouter>
            </Provider>
            );
    }
}

export default RoutingApp