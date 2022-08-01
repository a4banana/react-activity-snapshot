import { createContext, useReducer } from "react";
import type { Dispatch, ReactNode } from "react";

// this is dummy data
import { buyerInquirySellerForWorldMap as inqData } from '../assets/data.json'

console.log( inqData )

export enum InquiryActionType {
    GET_INQ,
}

export interface InquiryAction {
    type: InquiryActionType
}

type InquiryState = BuyerInquirySellerForWorldMapList

const initialState: InquiryState = inqData as BuyerInquirySellerForWorldMapList

/*
Conversion of type '{ cursorDate: string; count: number; inquiries: { id: number; sellerCountry: string; buyerCountry: string; product: { id: number; name: string; image: string; __typename: string; }; createdAt: string; __typename: string; }[]; __typename: string; }' to type 'BuyerInquirySellerForWorldMapList' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
  Types of property 'inquiries' are incompatible.
    Type '{ id: number; sellerCountry: string; buyerCountry: string; product: { id: number; name: string; image: string; __typename: string; }; createdAt: string; __typename: string; }[]' is not comparable to type 'BuyerInquirySellerForWorldMapType[]'.
      Type '{ id: number; sellerCountry: string; buyerCountry: string; product: { id: number; name: string; image: string; __typename: string; }; createdAt: string; __typename: string; }' is not comparable to type 'BuyerInquirySellerForWorldMapType'.
        Types of property 'id' are incompatible.
          Type 'number' is not comparable to type 'string'.
*/

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