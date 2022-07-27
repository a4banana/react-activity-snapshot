import { createContext, Dispatch, useReducer } from "react";
import type { ReactNode } from "react";

export const CycleContext = createContext<CycleState>( {} as CycleState )
export const CycleDispatchContext = createContext<Dispatch<CycleAction>>( {} as Dispatch<CycleAction> )

export enum CycleActionTypes {
    TOGGLE_PLAY, 
    PAUSE,
    PLAY
}

type CycleState = {
    cycle: number
    isPlaying: boolean
    isLoading: boolean
    progress: number
}

export interface CycleAction {
    type: CycleActionTypes
}

const initialState: CycleState = {
    cycle: 0, 
    isPlaying: false,
    isLoading: false,
    progress: 0
}

function cycleReducer( state: CycleState, { type }: CycleAction ): CycleState {
    switch ( type ) {
        case CycleActionTypes.PLAY:
            return { ...state, isPlaying: true }
        case CycleActionTypes.PAUSE: 
            return { ...state, isPlaying: false }
        case CycleActionTypes.TOGGLE_PLAY:
            const isPlaying: boolean = !state.isPlaying
            return { ...state, isPlaying }
    }
}

export function CycleProvider({ children }: { children: ReactNode }) {
    const [ cycle, dispatch ] = useReducer( cycleReducer, initialState )

    return (
        <CycleContext.Provider value={ cycle }>
            <CycleDispatchContext.Provider value={ dispatch }>
                { children }
            </CycleDispatchContext.Provider>
        </CycleContext.Provider>
    )
}