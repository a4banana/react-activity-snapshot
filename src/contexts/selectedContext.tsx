import { createContext, Dispatch, useContext, useEffect, useReducer } from "react";
import type { ReactNode } from "react";
import { CycleDispatchContext, CycleActionTypes, CycleContext } from "./cycleContext";

export const SelectedContext = createContext<SelectState>( {} as SelectState )
export const SelectedDispatchContext = createContext<Dispatch<Action>>( {} as Dispatch<Action> )

export enum SelectedActionTypes {
    SELECT_COUNTRY,
    SELECT_PRODUCT,
    DESELECT_COUNTRY,
    DESELECT_PRODUCT
}

export type SelectBaseString = 'product' | 'country' | null;

export interface SelectState {
    selectedCountry: CountryData | null
    selectedProduct: IProduct | null
    selectBase: SelectBaseString
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

const initialState: SelectState = {
    selectedCountry: null,
    selectedProduct: null,
    selectBase: null
}

function selectedReducer( state: SelectState, action: Action ): SelectState {
    switch ( action.type ) {
        case SelectedActionTypes.DESELECT_COUNTRY:
            return { ...state, selectedCountry: null, selectBase: ( state.selectedProduct ) ? 'product' : null }
        case SelectedActionTypes.DESELECT_PRODUCT:
            return { ...state, selectedProduct: null, selectBase: ( state.selectedCountry ) ? 'country' : null  }
        case SelectedActionTypes.SELECT_COUNTRY:
            return { ...state, selectedCountry: action.country, selectBase: checkBase( action.type, state )}
        case SelectedActionTypes.SELECT_PRODUCT:
            return { ...state, selectedProduct: action.product, selectBase: checkBase( action.type, state )}
        default:
            throw new Error( 'no action type' )
    }
}

export function SelectedProvider({ children }: { children: ReactNode }) {
    const [ selected, dispatch ] = useReducer( selectedReducer, initialState )
    const { isPlaying, isLoading } = useContext( CycleContext )
    const dispatchCycle = useContext( CycleDispatchContext )
    useEffect(() => {
        if (( selected.selectedCountry || selected.selectedProduct ) && isPlaying ) {
            dispatchCycle({ type: CycleActionTypes.PAUSE })
        }

        if ( !selected.selectedCountry && !selected.selectedProduct && !isPlaying && !isLoading ) {
            dispatchCycle({ type: CycleActionTypes.PLAY })
        }
    }, [ selected ])

    return (
        <SelectedContext.Provider value={ selected }>
            <SelectedDispatchContext.Provider value={ dispatch }>
                { children }
            </SelectedDispatchContext.Provider>
        </SelectedContext.Provider>
    )
}

const checkBase = ( actionType: SelectedActionTypes, { selectedCountry, selectedProduct, selectBase }: SelectState ): SelectBaseString => {
    switch( actionType ) {
        case SelectedActionTypes.SELECT_COUNTRY:
            return ( selectBase === 'product' && selectedProduct ) ? 'product' : 'country'
        case SelectedActionTypes.SELECT_PRODUCT:
            return ( selectBase === 'country' && selectedCountry ) ? 'country' : 'product'
        default:
            return null
    }
}