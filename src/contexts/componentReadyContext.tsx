import { createContext, useReducer } from "react";
import type { Dispatch, ReactNode } from "react";

export const QueuesContext = createContext<QueuesContext | null>( null )
export const QueuesDispatchContext = createContext<Dispatch<QueuesAction> | null>( null )

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

interface QueuesContext {
    isAllDone: boolean
    queues: QueueCollection
}

export interface QueuesAction {
    type: QueuesActionType;
    payload?: Queue | undefined
}

const initialState: QueuesContext = {
    isAllDone: true,
    queues: []
}

const hasKey = ( queues: QueueCollection, key: string ) => queues.some(( queue: Queue ) => queue.key === key )

function queuesReducer( state: QueuesContext, { type, payload }: QueuesAction ): QueuesContext {
    switch ( type ) {
        case QueuesActionType.INIT_QUEUE:
            return { isAllDone: true, queues: [] }
        case QueuesActionType.ADD_QUEUE: {
            if ( !payload ) return state
            const { key } = payload
            return {
                ...state,
                queues: [ ...state.queues, { key, isDone: false }]
            }
        }
        case QueuesActionType.DONE_QUEUE: {
            if ( !payload ) return state
            const { key } = payload
            if ( !hasKey( state.queues, key )) console.error( key + ' has never queued.' )
            return { ...state,
                queues: state.queues.map(( queue: Queue ) => ( queue.key === key && !queue.isDone ) ? { ...queue, isDone: true } : queue )
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