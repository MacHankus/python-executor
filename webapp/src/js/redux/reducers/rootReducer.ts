import processReducer from './processReducer'
import { combineReducers } from 'redux'
import loadingReducer from './loadingReducer'

const rootReducer = combineReducers({
    process: processReducer,
    loading: loadingReducer
})
export default rootReducer
//export type RootState = ReturnType<typeof rootReducer>