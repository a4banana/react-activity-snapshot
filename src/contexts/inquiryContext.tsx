import { createContext, useReducer } from "react";
import type { Dispatch, ReactNode } from "react";

//  * DUMMY FOR DEV: SHOULD BE REMOVED
import { buyerInquirySellerForWorldMap as inqData } from '../assets/data.json'
import { buyerInquirySellerForWorldMap as inqData2 } from '../assets/data2.json'

export enum InquiryActionType {
    LOAD,
    DONE,
}

interface InquiryLoad {
    type: InquiryActionType.LOAD
}
interface InquiryDone {
    type: InquiryActionType.DONE,
    data: BuyerInquirySellerForWorldMapList
}

type InquiryAction = InquiryLoad | InquiryDone

type State = {
    data: BuyerInquirySellerForWorldMapList
    cursorDate: string
    isLoading: boolean
}
const initialState: State = {
    data: {
        inquiries: [] as Array<BuyerInquirySellerForWorldMapType>,
        count: 0,
        cursorDate: ''
    },
    cursorDate: '',
    isLoading: false
}

export const InquiryContext = createContext<State>({} as State)
export const InquiryDispatchContext = createContext<Dispatch<InquiryAction>>({} as Dispatch<InquiryAction>)

function inqReducer( state: State, { type }: InquiryAction ): State {
    switch( type ) {
        case InquiryActionType.LOAD: {
            return { ...state, isLoading: true }
        }
        case InquiryActionType.DONE: {
            return { ...state, isLoading: true }
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


//  * DUMMY FOR DEV: SHOULD BE REMOVED
export function getInq( dispatch: Dispatch<InquiryAction>, cursorDate: string ) {
    const action = async ( dispatch: Dispatch<InquiryAction>, cursorDate: string ): Promise<void> => {
        dispatch({ type: InquiryActionType.LOAD })
        try {
            const data = await dummyFetch()
            dispatch({ type: InquiryActionType.DONE, data })
        } catch( err ) {
            // never happen in dummy
            console.error( err )
        }
    }

    return action
}

//  * DUMMY FOR DEV: SHOULD BE REMOVED
async function dummyFetch(): Promise<BuyerInquirySellerForWorldMapList> {
    return new Promise( resolve => {
        setTimeout( function() {
            resolve( inqData2 )
        }, 2000 )
    })    
}