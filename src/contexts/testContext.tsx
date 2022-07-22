import { createContext, useReducer } from "react";
import type { Dispatch } from "react";

export const TestsContext = createContext<Tests>( {} as Tests )
export const TestDispatchContext = createContext<Dispatch<TestAction>>( {} as Dispatch<TestAction> )

export enum TestActionEnum {
    ADD = 'ADD',
    REMOVE = 'REMOVE'
}

type Tests = Array<TestType>
type TestType = {
    id: number
    text?: string
    done?: boolean
}

interface TestAction {
    type: TestActionEnum
    payload: TestType
}

const initialTests: Tests = [
    { id: 0, text: 'dd', done: false },
    { id: 1, text: 'ee', done: false },
]

function testReducer( tests: Tests, { type, payload: { id, text }}: TestAction ) {
    switch( type ) {
        case TestActionEnum.ADD:
            return [ ...tests, { id, text, done: false }]
        case TestActionEnum.REMOVE:
            return tests.filter( t => t.id !== id )
        default:
            throw new Error( type + ' is unknown action' )
    }
}

export function TestProvider({ children }: any) {
    const [ tests, dispatch ] = useReducer( testReducer, initialTests );
    
    return (
        <TestsContext.Provider value={tests}>
            <TestDispatchContext.Provider value={dispatch}>
                { children }
            </TestDispatchContext.Provider>
        </TestsContext.Provider>
    );
}