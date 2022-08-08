import { createContext, Dispatch, useReducer, useEffect } from "react";
import type { ReactNode } from "react";
import { QueuesDispatchContext,  } from "./queuesContext";

export const CycleContext = createContext<CycleState>( {} as CycleState )
export const CycleDispatchContext = createContext<Dispatch<CycleAction>>( {} as Dispatch<CycleAction> )

export enum CycleActionTypes {
    TOGGLE_PLAY, 
    PAUSE,
    PLAY,
    LOAD_NEXT_CYCLE,
    NEXT_CYCLE
}

type CycleState = {
    cycle: number
    isPlaying: boolean
    isLoading: boolean
}

export interface CycleAction {
    type: CycleActionTypes
}

const initialState: CycleState = {
    cycle: 0, 
    isPlaying: false,
    isLoading: true
}

function cycleReducer( state: CycleState, { type }: CycleAction ): CycleState {
    switch ( type ) {
        case CycleActionTypes.PLAY:
            return { ...state, isPlaying: true }
        case CycleActionTypes.PAUSE:
            return { ...state, isPlaying: false }
        case CycleActionTypes.TOGGLE_PLAY:
            let isPlaying: boolean = !state.isPlaying
            return { ...state, isPlaying }
        case CycleActionTypes.LOAD_NEXT_CYCLE:
            return { ...state, isLoading: true, isPlaying: false }
        case CycleActionTypes.NEXT_CYCLE:
            // next cycle and 
            return { ...state, cycle: ++state.cycle, isLoading: false, isPlaying: true }
        default: {
            throw new Error( 'No action type' )
        }
    }
}

export function CycleProvider({ children }: { children: ReactNode }) {
    const [ cycle, dispatch ] = useReducer( cycleReducer, initialState )

    const { isLoading } = cycle

    useEffect(() => {
        if ( isLoading ) {
            
        }
    }, [ isLoading ])

    return (
        <CycleContext.Provider value={ cycle }>
            <CycleDispatchContext.Provider value={ dispatch }>
                { children }
            </CycleDispatchContext.Provider>
        </CycleContext.Provider>
    )
}