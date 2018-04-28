import combineReducers     from 'redux/lib/combineReducers'
import { routerReducer }   from 'react-router-redux/reducer'
import core                from './modules/core'

export default combineReducers({
    core    : core.reducer,
    router  : routerReducer
});
