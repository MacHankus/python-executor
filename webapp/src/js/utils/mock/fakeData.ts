import moment from 'moment'
import {arrayFiller} from './helpers'

function getRandomInt(min: number, max: number):number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
let date = ():string=>moment().format()
function text():string{
    const chars:string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ąśćźżłóńę'
    let newCharContainer:string = ''
    let newCharLength:number = getRandomInt(5, 50) 
    for(let i = 0; i < newCharLength ; i++){
        newCharContainer += chars[getRandomInt(0, chars.length - 1)]
    }
    return newCharContainer
}
export const projectRouteRowExample = {
    id:getRandomInt(1,10),
    name:"Project0",
    description: "Project doing something",
    last_start_date: date(),
    last_end_date: date(),
    last_success_date: date(),
    last_error_date: date(),
    last_error: text(),
    number_of_queues: getRandomInt(1,10),
    number_of_tasks: getRandomInt(3,30),
    queues:arrayFiller(4,{ 
        id:getRandomInt(1,10),
        name:text(),
        run_order:getRandomInt(1,10),
        blocking:true
    }),
    tasks:arrayFiller(7,{ 
        id:getRandomInt(1,10),
        file_path: text(),
        code: text(),
        function: text(),
        arguments: text()
    })

}
export const queuesExamples = arrayFiller(4,{ 
    id:getRandomInt(1,10),
    name:text(),
    run_order:getRandomInt(1,10),
    blocking:true
})
export const tasksExamples = arrayFiller(7,{ 
    id:getRandomInt(1,10),
    file_path: text(),
    code: text(),
    function: text(),
    arguments: text()
})
export const errorsExamples = arrayFiller(15,{ 
    id:getRandomInt(1,40),
    occur_date: date(),
    traceback: text(),
    task_id: getRandomInt(1,40),
})
export const runsExamples = arrayFiller(26,{ 
    id:getRandomInt(1,40),
    id_process: getRandomInt(1,40),
    start_date: date(),
    end_date: date(),
    success: true,
    error_msg:text()
})
