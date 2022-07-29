import { createContext, Dispatch, useReducer } from "react";
import type { ReactNode } from "react";

export const ProgressContext = createContext<ProgressState>( {} as ProgressState )
export const ProgressDispatchContext = createContext<Dispatch<ProgressAction>>( {} as Dispatch<ProgressAction> )

export enum ProgressActionTypes {
    SET_PROGRESS
}

type ProgressState = {
    progress: number
}

export interface ProgressAction {
    type: ProgressActionTypes
    value: number
}

const initialState: ProgressState = {
    progress: 0
}

function progressReducer( state: ProgressState, { type, value }: ProgressAction ): ProgressState {
    switch ( type ) {
        case ProgressActionTypes.SET_PROGRESS: {
            return { progress: value }
        }
    }
}

export function ProgressProvider({ children }: { children: ReactNode }) {
    const [ progress, dispatch ] = useReducer( progressReducer, initialState )

    return (
        <ProgressContext.Provider value={ progress }>
            <ProgressDispatchContext.Provider value={ dispatch }>
                { children }
            </ProgressDispatchContext.Provider>
        </ProgressContext.Provider>
    )
}