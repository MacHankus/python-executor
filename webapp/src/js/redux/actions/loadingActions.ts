import { loadingConstants } from './actionConstants';



export function startLoading(){
    return {
        type: loadingConstants.START_LOADING,
        payload: true
    }
}


export function stopLoading(){
    return {
        type: loadingConstants.STOP_LOADING,
        payload: false
    }
}