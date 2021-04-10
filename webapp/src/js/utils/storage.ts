
class LocalStorageNotSupported extends Error {
    constructor(message : string){
        super(message)
    }
}

export function readStorage(content:string, key:string) {
    if (typeof window === 'undefined'){
        return null
    }
    if (!window.localStorage) {
        console.error("localStorage is not supported for this browser.")
        return null
        throw new LocalStorageNotSupported("localStorage is not supported for this browser")
    }
    const fetchedContent = window.localStorage.getItem(content) || "{}"
    let json
    try {
        json = JSON.parse(fetchedContent)
    } catch (err) {
        return null
    }

    return json[key]
}

export function writeStorage(content:string, key:string, value:any) {
    if (typeof window === 'undefined'){
        return
    }
    if (!window.localStorage) {
        console.error("localStorage is not supported for this browser.")
        return
        throw new LocalStorageNotSupported("localStorage is not supported for this browser")
    }
    const fetchedContent = window.localStorage.getItem(content) || "{}"
    let json
    try {
        json = JSON.parse(fetchedContent)
    } catch (err) {
        return
    }
    let newJson = Object.assign({},json,{[key]:value})

    window.localStorage.setItem(content,JSON.stringify(newJson))
}