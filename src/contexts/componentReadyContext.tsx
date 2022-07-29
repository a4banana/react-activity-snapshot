import { createContext, useReducer } from "react";
import type { Dispatch, ReactNode } from "react";

export const QueuesContext = createContext<QueuesContext | null>( null )
export const QueuesDispatchContext = createContext<Dispatch<QueuesActions> | null>( null )

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
    payload: Queue
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
            const { key } = action.payload
            return {
                ...state,
                queues: [ ...state.queues, { key, isDone: false }]
            }
        }
        case QueuesActionType.DONE_QUEUE: {
            return { ...state,
                queues: state.queues.map(( queue: Queue ) => 
                    matchKeyAndIsDone( queue, action.payload.key )
                        ? { ...queue, isDone: true } : queue
                )
            }
        }
    }
}

export function QueuesProvider({ children }: { children: ReactNode }) {
    const [ queues, dispatch ] = useReducer( queuesReducer, initialState );

    return (
        <QueuesContext.Provider value={ queues }>
            <QueuesDispatchContext.Provider value={ dispatch }>
                { children }
            </QueuesDispatchContext.Provider>
        </QueuesContext.Provider>
    );
}