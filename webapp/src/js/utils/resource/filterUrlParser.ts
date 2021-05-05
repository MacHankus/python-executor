import React from 'react'

interface EqualityOperatorConstructor {
    new(opr: string, repr: string, descr: string): void
}
interface EqualityOperatorInterface {
    operator: string,
    representation: string,
    description: string,
    toString: () => void,
    buildFrom: (key: string, value: string) => string
}
const EqualityOperator: EqualityOperatorConstructor = class EqualityOperator implements EqualityOperatorInterface {
    operator: string
    representation: string
    description: string
    constructor(opr: string, repr: string, descr: string) {
        this.operator = opr
        this.representation = repr
        this.description = descr
    }
    toString() {
        return this.representation
    }
    buildFrom(key: string, value: string) {
        return `${key}=${this.representation}:${value}`
    }
}

export interface EqualityOperatorManagerInterface {
    like:()=> EqualityOperatorInterface,
    regexp:()=>EqualityOperatorInterface,
    eq:()=> EqualityOperatorInterface,
    gte:()=> EqualityOperatorInterface,
    lte:()=>EqualityOperatorInterface,
    gt:()=> EqualityOperatorInterface,
    lt:()=>EqualityOperatorInterface
}
const EqualityOperatorManager = class EqualityOperatorManager implements EqualityOperatorManagerInterface {
    like():EqualityOperatorInterface{ return new EqualityOperator("like", "like", "Implements like filtering with % and _ operators.")}
    regexp():EqualityOperatorInterface{ return new EqualityOperator("regexp", "regexp", "Implements regexp filtering.") }
    eq():EqualityOperatorInterface{ return new EqualityOperator("=", "eq", "Implements equality filtering for given value.") }
    gte():EqualityOperatorInterface{ return new EqualityOperator(">=", "gte", "Implements greater then or equal filtering for given value.") }
    lte():EqualityOperatorInterface{ return new EqualityOperator("<=", "lte", "Implements less then or equal filtering for given value.") }
    gt():EqualityOperatorInterface{ return new EqualityOperator(">", "gt", "Implements greater then filtering for given value.") }
    lt():EqualityOperatorInterface{ return new EqualityOperator("<", "lt", "Implements less then filtering for given value.") }
}

export default EqualityOperatorManager