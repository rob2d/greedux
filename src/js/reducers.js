import { combineReducers } from 'redux'
import core                from './modules/core'
import toilet   from './modules/toilet'
import { routerReducer }   from 'react-router-redux'

export default combineReducers(
{
    [core.constants.NAME]              : core.reducer,
    [toilet.constants.NAME] : toilet.reducer,
    router                             : routerReducer
});
