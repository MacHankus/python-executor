import { apiRoot } from './config'

export let processResource: (id?:number) => string =
    function (id?:number) {
        if(id){
            return `${apiRoot}/process/${id}`
        }
        return `${apiRoot}/process`
    }
export let processQueueResource: (id:number) => string =
    function (id:number) {
        return `${apiRoot}/process/${id}/queue`
    }
export let processTaskResource: (id:number) => string =
    function (id:number) {
        return `${apiRoot}/process/${id}/task`
    }
export let processErrorResource: (id:number) => string =
    function (id:number) {
        return `${apiRoot}/process/${id}/error`
    }
export let processRunResource: (id:number) => string =
    function (id:number) {
        return `${apiRoot}/process/${id}/error`
    }
export let processStatsResource: () => string =
    function () {
        return `${apiRoot}/process/stats`
    }