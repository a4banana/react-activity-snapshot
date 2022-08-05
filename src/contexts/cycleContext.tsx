import { createContext, Dispatch, useEffect, useReducer } from "react";
import type { ReactNode } from "react";

export const CycleContext = createContext<CycleState>( {} as CycleState )
export const CycleDispatchContext = createContext<Dispatch<CycleAction>>( {} as Dispatch<CycleAction> )

export enum CycleActionTypes {
    TOGGLE_PLAY, 
    PAUSE,
    PLAY,
    LOADING,
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
    isPlaying: true,
    isLoading: false
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
        default: {
            throw new Error( 'no action type' )
        }
    }
}

export function CycleProvider({ children }: { children: ReactNode }) {
    const [ cycle, dispatch ] = useReducer( cycleReducer, initialState )

    // useEffect(() => {
    //     console.log( cycle )
    // }, [ cycle ])

    return (
        <CycleContext.Provider value={ cycle }>
            <CycleDispatchContext.Provider value={ dispatch }>
                { children }
            </CycleDispatchContext.Provider>
        </CycleContext.Provider>
    )
}