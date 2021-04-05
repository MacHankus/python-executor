import { processActions } from './actionConstants'

export function setProcess(id: number) {
    return {
        type: processActions.SET_PROCESS,
        payload: id
    }
}
