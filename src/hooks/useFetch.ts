import { useRef, useEffect, useReducer } from "react";
import type { MutableRefObject } from "react";

enum ActionTypes {
    LOADING,
    FETCHED,
    ERROR
}

interface State<T> {
    data?: T
    error?: Error
}

interface ActionLoading {
    type: ActionTypes.LOADING
}

interface ActionFetch<T> {
    type: ActionTypes.FETCHED,
    payload: T
}

interface ActionError<T> {
    type: ActionTypes.ERROR,
    payload: Error
}

type FetchAction<T> = ActionLoading | ActionFetch<T> | ActionError<T>

export default function useFetch<T = unknown>( uri: string ): State<T> {
    const isLoading: MutableRefObject<boolean> = useRef( false )
    const initialState: State<T> = {
        data: undefined,
        error: undefined
    }

    const fetchReducer = ( state: State<T>, action: FetchAction<T> ): State<T> => {
        switch( action.type ) {
            case ActionTypes.LOADING:
                return { ...initialState }
            case ActionTypes.FETCHED:
                return { ...initialState, data: action.payload }
            case ActionTypes.ERROR:
                return { ...initialState, error: action.payload }
            default:
                return state
        }
    }
    const [ state, dispatch ] = useReducer( fetchReducer, initialState )

    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: ActionTypes.LOADING })

            try {
                const res = await fetch( uri )
                if ( !res.ok ) throw new Error( res.statusText )

                const data = ( await res.json() ) as T
                dispatch({ type: ActionTypes.FETCHED, payload: data })
                
            } catch ( err ) {
                console.error( err )
                dispatch({ type: ActionTypes.ERROR, payload: err as Error })
            } finally {
                isLoading.current = false
            }
        }

        void fetchData()
    }, [ uri ])

    return state
}