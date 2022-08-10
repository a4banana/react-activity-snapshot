import { createContext, useContext, useEffect, useReducer } from "react";
import type { Dispatch, ReactNode } from "react";
import { CycleDispatchContext, CycleActionTypes } from "./cycleContext";
import usePrevious from "../hooks/usePrevious";

export const QueuesContext = createContext<QueuesContext>( {} as QueuesContext )
export const QueuesDispatchContext = createContext<Dispatch<QueuesActions>>( {} as Dispatch<QueuesActions> )

export enum QueuesActionType {
    ALL_DONE,
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
    type: QueuesActionType.ALL_DONE
}

type QueuesActions = ActionWithPayload | ActionWithoutPayload

const initialState: QueuesContext = {
    isAllDone: true,
    queues: []
}

function queuesReducer( state: QueuesContext, action: QueuesActions ): QueuesContext {
    const { type } = action
    
    switch ( type ) {
        case QueuesActionType.ALL_DONE: {
            return { ...state, isAllDone: true }
        }
        case QueuesActionType.ADD_QUEUE: {
            const { key } = action
            // console.log( key + ' is added' )
            return {
                isAllDone: state.isAllDone ? false : state.isAllDone,
                queues: [ ...state.queues, { key, isDone: false }]
            }
        }
        case QueuesActionType.DONE_QUEUE: {
            // console.log( action.key + ' is doned' )
            // if( !hasKey( state.queues, action.key ) ) console.log( 'theres no ' + action.key )
            return { ...state,
                queues: state.queues.filter( queue => exceptKey( queue, action.key ))
            }
        }
    }
}

export function QueuesProvider({ children }: { children: ReactNode }) {
    const [ queuesState, dispatch ] = useReducer( queuesReducer, initialState );
    const { queues, isAllDone } = queuesState
    const dispatchCycle = useContext( CycleDispatchContext )
    const prev = usePrevious<boolean>( isAllDone )

    // isAllDone
    useEffect(() => {
        if ( queues.length === 0 && !isAllDone ) {
            dispatch({ type: QueuesActionType.ALL_DONE })
        }
    }, [ queues ])

    useEffect(() => {
        if ( prev === false && isAllDone )
            dispatchCycle({ type: CycleActionTypes.NEXT_CYCLE })
    }, [ isAllDone ])

    return (
        <QueuesContext.Provider value={ queuesState }>
            <QueuesDispatchContext.Provider value={ dispatch }>
                { children }
            </QueuesDispatchContext.Provider>
        </QueuesContext.Provider>
    );
}

const hasKey = ( queues: QueueCollection, key: string ): boolean => queues.some( queue => queue.key === key )
const exceptKey = ( queue: Queue, key: string ): boolean => queue.key !== key