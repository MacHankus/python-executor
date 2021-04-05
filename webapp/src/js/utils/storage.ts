
class LocalStorageNotSupported extends Error {
    constructor(message : string){
        super(message)
    }
}

export function readStorage(content:string, key:string) {
    if (!window.localStorage) {
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
    if (!window.localStorage) {
        throw new LocalStorageNotSupported("localStorage is not supported for this browser")
    }
    const fetchedContent = window.localStorage.getItem(content) || "{}"
    let json
    try {
        json = JSON.parse(fetchedContent)
    } catch (err) {
        return null
    }
    let newJson = Object.assign({},json,{[key]:value})

    window.localStorage.setItem(content,JSON.stringify(newJson))
}