import { Provider } from 'react-redux';
import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import appHistory from 'tools/appHistory';
import MainApp from './core/components/MainApp';
import { ConnectedRouter } from 'react-router-redux';
import store from '../store';


class RoutingApp extends Component {
    render () {
        return (
            <Provider store={ store }>
                <ConnectedRouter history={ appHistory }>
                    <Route
                        exact path='/'
                        component={ MainApp }
                    />
                </ConnectedRouter>
            </Provider>
            );
    }
}

export default RoutingApp