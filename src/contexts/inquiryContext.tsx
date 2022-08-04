import { createContext, useReducer } from "react";
import type { Dispatch, ReactNode } from "react";

// this is dummy data
import { buyerInquirySellerForWorldMap as inqData } from '../assets/data.json'

export enum InquiryActionType {
    GET_INQ,
}

export interface InquiryAction {
    type: InquiryActionType
}

type State = BuyerInquirySellerForWorldMapList
const initialState: State = inqData

export const InquiryContext = createContext<State | null>( null )
export const InquiryDispatchContext = createContext<Dispatch<InquiryAction> | null>( null )

function inqReducer( state: State, { type }: InquiryAction ): State {
    switch( type ) {
        case InquiryActionType.GET_INQ: {
            return state
        }
    }
}

export function InquiryProvider({ children }: { children: ReactNode }) {
    const [ inquiries , dispatch ] = useReducer( inqReducer, initialState )
    
    return (
        <InquiryContext.Provider value={ inquiries }>
            <InquiryDispatchContext.Provider value={ dispatch }>
                { children }
            </InquiryDispatchContext.Provider>
        </InquiryContext.Provider>
    )
}