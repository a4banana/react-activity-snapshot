import { createContext, useEffect, useReducer } from "react";
import type { Dispatch, ReactNode } from "react";

export const QueuesContext = createContext<QueuesContext>( {} as QueuesContext )
export const QueuesDispatchContext = createContext<Dispatch<QueuesActions>>( {} as Dispatch<QueuesActions> )

export enum QueuesActionType {
    INIT_QUEUE,
    ADD_QUEUE,
    DONE_QUEUE
}

type Queue = {
    key: string
    isDone: boolean
}

type QueueCollection = Array<Queue>

type QueuesContext = {
    isAllDone: boolean
    queues: QueueCollection
}

interface ActionWithPayload {
    type: QueuesActionType.ADD_QUEUE | QueuesActionType.DONE_QUEUE
    key: string
}

interface ActionWithoutPayload {
    type: QueuesActionType.INIT_QUEUE
}

type QueuesActions = ActionWithPayload | ActionWithoutPayload

const initialState: QueuesContext = {
    isAllDone: true,
    queues: []
}

// const hasKey = ( queues: QueueCollection, key: string ) => queues.some(( queue: Queue ) => queue.key === key )
const matchKeyAndIsDone = ( queue: Queue, key: string ): boolean => queue.key === key && !queue.isDone

function queuesReducer( state: QueuesContext, action: QueuesActions ): QueuesContext {
    const { type } = action
    
    switch ( type ) {
        case QueuesActionType.INIT_QUEUE: {
            return { isAllDone: true, queues: [] }
        }
        case QueuesActionType.ADD_QUEUE: {
            const { key } = action
            console.log( key + ' is added' )
            return {
                ...state,
                queues: [ ...state.queues, { key, isDone: false }]
            }
        }
        case QueuesActionType.DONE_QUEUE: {
            console.log( 'done queue!' )
            return { ...state,
                queues: state.queues.map(( queue: Queue ) => 
                    matchKeyAndIsDone( queue, action.key )
                        ? { ...queue, isDone: true } : queue
                )
            }
        }
    }
}

export function QueuesProvider({ children }: { children: ReactNode }) {
    const [ queuesState, dispatch ] = useReducer( queuesReducer, initialState );
    const { queues, isAllDone } = queuesState

    // isAllDone
    useEffect(() => {
        if ( queues.length > 0 && !isAllDone ) {
            
        }
    }, [ queues ])

    return (
        <QueuesContext.Provider value={ queuesState }>
            <QueuesDispatchContext.Provider value={ dispatch }>
                { children }
            </QueuesDispatchContext.Provider>
        </QueuesContext.Provider>
    );
}