import { createContext, Dispatch, useReducer } from "react";
import type { ReactNode } from "react";

export const CycleContext = createContext<CycleState>( {} as CycleState )
export const CycleDispatchContext = createContext<Dispatch<CycleAction>>( {} as Dispatch<CycleAction> )

export enum CycleActionTypes {
    TOGGLE_PLAY, 
    PAUSE,
    PLAY,
    SET_PROGRESS
}

type CycleState = {
    cycle: number
    isPlaying: boolean
    isLoading: boolean
    progress: number
}

export interface CycleAction {
    type: CycleActionTypes
    payload?: {
        progress: number
    }
}

const initialState: CycleState = {
    cycle: 0, 
    isPlaying: true,
    isLoading: false,
    progress: 0
}

function cycleReducer( state: CycleState, { type, payload }: CycleAction ): CycleState {
    switch ( type ) {
        case CycleActionTypes.PLAY: {
            return { ...state, isPlaying: true }
        }
        case CycleActionTypes.PAUSE: {
            return { ...state, isPlaying: false }
        }
        case CycleActionTypes.TOGGLE_PLAY: {
            const isPlaying: boolean = !state.isPlaying
            return { ...state, isPlaying }
        }
        case CycleActionTypes.SET_PROGRESS: {
            if ( !payload ) return state
            const { progress } = payload
            return { ...state, progress }
        }
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