
export function arrayFiller(nloops: number = 1, objectToPopulate: any){
    let array = []
    for (let i = 0; i < nloops;i++){
        array.push(objectToPopulate)
    }
    return array
}

