import { createContext, Dispatch, useContext, useEffect, useReducer } from "react";
import type { ReactNode } from "react";
import { CycleDispatchContext, CycleActionTypes } from "./cycleContext";

export const SelectedContext = createContext<State>( {} as State )
export const SelectedDispatchContext = createContext<Dispatch<Action>>( {} as Dispatch<Action> )

export enum SelectedActionTypes {
    SELECT_COUNTRY,
    SELECT_PRODUCT,
    DESELECT_COUNTRY,
    DESELECT_PRODUCT
}

interface State {
    selectedCountry: CountryData | null
    selectedProduct: IProduct | null
    selectBase: 'product' | 'country' | null
}

interface SelectCountryAction {
    type: SelectedActionTypes.SELECT_COUNTRY
    country: CountryData
}

interface SelectProductAction {
    type: SelectedActionTypes.SELECT_PRODUCT
    product: IProduct
}

interface DefaultAction {
    type: SelectedActionTypes.DESELECT_COUNTRY | SelectedActionTypes.DESELECT_PRODUCT
}

type Action = SelectCountryAction | SelectProductAction | DefaultAction

const initialState: State = {
    selectedCountry: null,
    selectedProduct: null,
    selectBase: null
}

function selectedReducer( state: State, action: Action ): State {
    switch ( action.type ) {
        case SelectedActionTypes.DESELECT_COUNTRY:
            return { ...state, selectedCountry: null, selectBase: ( state.selectedProduct ) ? 'product' : null }
        case SelectedActionTypes.DESELECT_PRODUCT:
            return { ...state, selectedProduct: null, selectBase: ( state.selectedCountry ) ? 'country' : null  }
        case SelectedActionTypes.SELECT_COUNTRY:
            return { ...state, selectedCountry: action.country, selectBase: ( state.selectedProduct ) ? 'product' : 'country' }
        case SelectedActionTypes.SELECT_PRODUCT:
            return { ...state, selectedProduct: action.product, selectBase: ( state.selectedCountry ) ? 'country' : 'product' }
        default:
            throw new Error( 'no action type' )
    }
}

export function SelectedProvider({ children }: { children: ReactNode }) {
    const [ selected, dispatch ] = useReducer( selectedReducer, initialState )
    const dispatchCycle = useContext( CycleDispatchContext )

    useEffect(() => {
        ( selected.selectedCountry || selected.selectedProduct )
            ? dispatchCycle({ type: CycleActionTypes.PAUSE })
            : dispatchCycle({ type: CycleActionTypes.PLAY })
    }, [ selected ])

    return (
        <SelectedContext.Provider value={ selected }>
            <SelectedDispatchContext.Provider value={ dispatch }>
                { children }
            </SelectedDispatchContext.Provider>
        </SelectedContext.Provider>
    )
}