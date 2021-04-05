
import rootReducer from '../reducers/rootReducer'
import { createStore, applyMiddleware } from 'redux'

const logger = store => next => action => {
    console.log('dispatching', action)
    let result = next(action)
    console.log('next state', store.getState())
    return result
  }
  
const store = createStore(rootReducer, applyMiddleware(logger))
export default store