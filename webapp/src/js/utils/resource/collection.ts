import { apiRoot } from './config'

export let processResource: (id?:number) => string =
    function (id?:number) {
        if(id){
            return `${apiRoot}/processes/${id}`
        }
        return `${apiRoot}/processes`
    }
export let processQueueResource: (id:number) => string =
    function (id:number) {
        return `${apiRoot}/processes/${id}/queues`
    }
export let processTaskResource: (id:number) => string =
    function (id:number) {
        return `${apiRoot}/processes/${id}/tasks`
    }
export let processErrorResource: (id:number) => string =
    function (id:number) {
        return `${apiRoot}/processes/${id}/errors`
    }
export let processRunResource: (id:number) => string =
    function (id:number) {
        return `${apiRoot}/processes/${id}/runs`
    }
export let processStatsResource: () => string =
    function () {
        return `${apiRoot}/processes/stats`
    }