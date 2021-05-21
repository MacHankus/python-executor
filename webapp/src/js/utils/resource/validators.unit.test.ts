import Validator, {ReturnedValidInfo} from './validators'

describe("Validator test",()=>{
    test('number.number check not valid ', () => {
        const texts = ["test","123test","!@#$%^&*(){}:\"<>?|=- ","123 123","123-123"]
        for (let text of texts){
            const valid = Validator.number.number.validate(text)
            expect(valid).not.toBe(null)
            expect(valid).toBeInstanceOf(ReturnedValidInfo)
            expect(valid?.error).toBe(true)
            expect(valid?.errorMsg).toBe("Numbers allowed only")
        }

    });
    test('number.number check success', () => {
        const valid = Validator.number.number.validate("1249999")
        expect(valid).toBe(null)
    });
    test('text.name check not valid', () => {
        const texts = ["TEST!@","TEST&1","TEST=1","TEST.test"]
        for (let text of texts){
            const valid = Validator.text.name.validate(text)
            expect(valid).not.toBe(null)
            expect(valid).toBeInstanceOf(ReturnedValidInfo)
            expect(valid?.error).toBe(true)
            expect(valid?.errorMsg).toBe("Only [ - , _ , aA-zZ ] allowed")
        }
    });
    test('text.name check', () => {
        const texts = ["TEST","test","test_1_project","Test-1-project"]
        for (let text of texts){
            const valid = Validator.text.name.validate(text)
            expect(valid).toBe(null)
        }
    });
    test('text.likeStatement check', () => {
        const texts = ["TEST","test","test_1_project","Test-1-project","!@$#%^&*()_+{}|\":?<,./;'[]\\-='","1243"]
        for (let text of texts){
            const valid = Validator.text.likeStatement.validate(text)
            expect(valid).toBe(null)
        }
    });
})

