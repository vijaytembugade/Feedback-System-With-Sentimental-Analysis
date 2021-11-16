import { combineReducers } from 'redux'
import adminReducer from './adminReducer'
import studentReducer from './studentReducer'
import authReducer from './authReducer';

export default combineReducers({
    auth:authReducer,
    admin: adminReducer,
    student: studentReducer
})

