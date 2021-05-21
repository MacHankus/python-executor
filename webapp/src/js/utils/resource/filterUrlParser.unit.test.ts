import EqualityOperatorManager, {EqualityOperator} from './filterUrlParser'



describe("EqualityOperatorManager check",()=>{
    test("Check all attributes are sme instance",()=>{
        const eom = new EqualityOperatorManager()
        expect(eom.like()).toBeInstanceOf(EqualityOperator)
        expect(eom.regexp()).toBeInstanceOf(EqualityOperator)
        expect(eom.gt()).toBeInstanceOf(EqualityOperator)
        expect(eom.gte()).toBeInstanceOf(EqualityOperator)
        expect(eom.lt()).toBeInstanceOf(EqualityOperator)
        expect(eom.lte()).toBeInstanceOf(EqualityOperator)
        expect(eom.eq()).toBeInstanceOf(EqualityOperator)
    })
    test("Check all values in all attributes",()=>{
        const parameters = [
            ["like","like", "like", "Implements like filtering with % and _ operators."]
            ,["regexp","regexp", "regexp", "Implements regexp filtering."]
            ,["eq","=", "eq", "Implements equality filtering for given value."]
            ,["gte",">=", "gte", "Implements greater then or equal filtering for given value."]
            ,["lte","<=", "lte", "Implements less then or equal filtering for given value."]
            ,["gt",">", "gt", "Implements greater then filtering for given value."]
            ,["lt","<", "lt", "Implements less then filtering for given value."]
        ]
        const eom = new EqualityOperatorManager()
        for (let param of parameters){
            const fun = (eom as any)[param[0]]
            const eo = fun()
            expect(eo.operator).toBe(param[1])
            expect(eo.representation).toBe(param[2])
            expect(eo.description).toBe(param[3])
        }

    })
})
describe("EqualityOperator instance check",()=>{
    test("Instance creation and attributes/methods checking",()=>{
        const eo = new EqualityOperator("myoperator",":-)","Test description")
        expect(eo.description).toBe("Test description")
        expect(eo.representation).toBe(":-)")
        expect(eo.operator).toBe("myoperator")
        expect(eo.buildFrom("someColumn","someValue")).toBe("someColumn=:-):someValue")
    })
})