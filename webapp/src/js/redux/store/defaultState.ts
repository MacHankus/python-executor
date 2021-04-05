export interface Process {
    idProcess: number | null,
    idRun: number | null
    
}
export interface Loading {
    loading: boolean
}
export interface defaultStateInterface {
    process: Process,
    loading: Loading
}
const process: Process = {
    idProcess:null,
    idRun: null
}
const loading: Loading = {
    loading:true
}
export const defaultState: defaultStateInterface = {
    process: process,
    loading: loading
}
