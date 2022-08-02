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

type InquiryState = BuyerInquirySellerForWorldMapList

const initialState: InquiryState = inqData as BuyerInquirySellerForWorldMapList

export const InquiryContext = createContext<InquiryState | null>( null )
export const InquiryDispatchContext = createContext<Dispatch<InquiryAction> | null>( null )

function inqReducer( state: InquiryState, { type }: InquiryAction ): InquiryState {
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