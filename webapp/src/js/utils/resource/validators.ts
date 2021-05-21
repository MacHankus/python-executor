
export class ReturnedValidInfo {
    error:boolean
    errorMsg: string
    constructor(error:boolean,errorMsg: string){
        this.error = error
        this.errorMsg = errorMsg
    }
    toString(){
        return this.errorMsg
    }

}
abstract class TypeValidator { 
    likeStatementReg:string = ".*"
    numbersReg:string  = "^\\d*$"
    nameReg = "^[\\d\\_\\-\\aA-zZ]*$"
    abstract validate:(test:string)=> null | ReturnedValidInfo
}

class LikeStatementValidator extends TypeValidator {
    validate = (text:string) => {
        const reg = new RegExp(this.likeStatementReg)
        if (text.match(reg)){
            return null
        }
        return new ReturnedValidInfo(true,"Characters allowed only")
    }
}
class NumberValidator extends TypeValidator {
    validate = (text:string) =>{
        if (text.match(this.numbersReg)){
            return null
        }
        return new ReturnedValidInfo(true,"Numbers allowed only")
    }
}
class NameValidator extends TypeValidator {
    validate = (text:string) =>{
        if (text.match(this.nameReg)){
            return null
        }
        return new ReturnedValidInfo(true,"Only [ - , _ , aA-zZ ] allowed")
    }
}



export default class Validator {
    static text = {
        likeStatement: new LikeStatementValidator(),
        name: new NameValidator()
    }
    static number = {
        number: new NumberValidator(),
    }
}