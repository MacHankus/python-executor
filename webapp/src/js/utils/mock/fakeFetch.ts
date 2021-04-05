
function fakeFetch(seconds: number = 1, whatToReturn:object = {}, inside?: string,errorToThrow?: any){
    return ()=> new Promise((resolve,reject) => {
        setTimeout(()=>{
            if (errorToThrow){
                throw errorToThrow()
            }
            if (inside){
                whatToReturn = {[inside]:whatToReturn}
            } 
            var blob = new Blob([JSON.stringify(whatToReturn)], {type : 'application/json'});
            var init = { "status" : 200 , "statusText" : "Returned fake response." };
            var myResponse = new Response(blob, init);
            resolve(myResponse)
        },seconds*1000)
    })
} 

export default fakeFetch