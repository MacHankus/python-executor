import React from 'react'

interface EqualityOperatorConstructor {
    new(opr: string, repr: string, descr: string)
}
interface EqualityOperatorInterface {
    operator: string,
    representation: string,
    description:string,
    toString(): void,
    buildFrom(key,value): string
}
const EqualityOperator: EqualityOperatorConstructor = class EqualityOperator implements EqualityOperatorInterface{
    operator: string
    representation: string
    description: string
    constructor(opr: string, repr: string, descr: string){
        this.operator = opr
        this.representation = repr
        this.description = descr
    }
    toString(){
        return this.representation
    }
    buildFrom(key: string, value:string){
        return `${key}=${this.representation}:${value}`
    }
}

interface EqualityOperatorManagerInterface {
    like(): EqualityOperatorConstructor,
    regexp(): EqualityOperatorConstructor,
    eq(): EqualityOperatorConstructor,
    gte(): EqualityOperatorConstructor,
    lte(): EqualityOperatorConstructor,
    gt(): EqualityOperatorConstructor,
    lt(): EqualityOperatorConstructor
}
const EqualityOperatorManager = class EqualityOperatorManager implements EqualityOperatorManagerInterface{
    like(){ return new EqualityOperator("like","like","Implements like filtering with % and _ operators.")}
    regexp(){ return new EqualityOperator("regexp","regexp","Implements regexp filtering.")}
    eq(){ return new  EqualityOperator("=","eq","Implements equality filtering for given value.")}
    gte(){ return new  EqualityOperator(">=","gte","Implements greater then or equal filtering for given value.")}
    lte(){ return new EqualityOperator("<=","lte","Implements less then or equal filtering for given value.")}
    gt(){ return  new EqualityOperator(">","gt","Implements greater then filtering for given value.")}
    lt(){ return new EqualityOperator("<","lt","Implements less then filtering for given value.")}
}
/*
interface FilterUrlParserConstructor {
    new(baseRoute: string): FilterUrlParserInterface
}
interface FilterUrlParserInterface {
    baseRoute:string,

}

const FilterUrlParser: FilterUrlParserConstructor = class FilterUrlParser implements FilterUrlParserInterface{
    baseRoute: string
    constructor(baseRoute: string){
        this.baseRoute = baseRoute
    }
    
}
*/


export EqualityOperatorManager
//export default FilterUrlParser