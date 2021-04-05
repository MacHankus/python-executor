import { defaultState } from '../store/defaultState'
import { Action } from '../actions/types'
import { loadingConstants } from '../actions/actionConstants'

export default function processReducer(
    state = defaultState.loading
    , action:Action) {
    switch (action.type) {
        case loadingConstants.START_LOADING:
            return Object.assign({}, state, { loading: action.payload })
        case loadingConstants.STOP_LOADING:
            return Object.assign({}, state, { loading: action.payload })
    }
    return state
}