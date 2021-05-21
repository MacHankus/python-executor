import { Type } from "typescript";

export interface ApiInputCommonProps {
    onChange: (name:string,query: string | null, value:any,error:boolean) => void,
    name: string,
    visibleName: string,
    validate?: (value:any | string | number )=> object | null
}
export interface ApiInputCommonSate {
    value : any | null,
    managerIndex: number,
    error: boolean | undefined,
    errorMsg: string | null
}