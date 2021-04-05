import { defaultState } from '../store/defaultState'
import { Action } from '../actions/types'
import { processConstants } from '../actions/actionConstants'

export default function processReducer(
    state = defaultState.process
    , action:Action) {
    switch (action.type) {
        case processConstants.SET_PROCESS:
            return Object.assign({}, state, { idProcess: action.payload })
        case processConstants.SET_RUN:
            return Object.assign({}, state, { idRun: action.payload })
    }
    return state
}