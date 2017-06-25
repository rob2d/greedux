import { applyMiddleware, createStore } from 'redux'
import thunk  from 'redux-thunk'
import promise from 'redux-promise-middleware'
import reducer from './reducers'
import localizer from 'middleware/localizer'
import logger from 'redux-logger'
import { routerMiddleware } from 'react-router-redux'
import appHistory from 'tools/appHistory'

const middleware = process.env.NODE_ENV == 'production' ?
                        applyMiddleware(
                            promise(),
                            thunk,
                            localizer,
                            routerMiddleware(appHistory) //for intercepting navigation actions
                        ) : applyMiddleware(
                            promise(),
                            thunk,
                            logger,
                            localizer,
                            routerMiddleware(appHistory)
                        );

export default createStore(reducer, middleware)