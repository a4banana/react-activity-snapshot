import { createContext, useReducer } from "react";
import type { Dispatch, ReactNode } from "react";

export enum ProductsActionType {
    SELECT,
    DESELECT,
    TOGGLE
}

interface ProductsAction {
    type: ProductsActionType
}

type ProductCollection = Array<IProduct>

const initialState: ProductCollection = [] as ProductCollection

export const ProductsContext = createContext<ProductCollection | null>( null )
export const ProductsDispatchContext = createContext<Dispatch<ProductsAction> | null>( null )

/*
function getProductList( inqs: Array<BuyerProductsSellerForWorldMapType> ) {
    let products: Array<IProduct> = []

    const hasProduct = ( id: number ) => products.some(( p: IProduct ) => p.id === id )
    const pushProduct = ({ id, name, image }: Product ) => {
        products.push({ id, name, image, index: products.length, count: 1, selected: false, disabled: false })
    }
    const updateProduct = ( id: number ) => products.map( p => ( p.id === id ? { ...p, count: p.count++ } : p ))
    
    inqs.forEach( inq => {
        hasProduct( inq.product.id ) ? updateProduct( inq.product.id ) : pushProduct( inq.product )
    })
    
    return products.sort(( a, b ) => b.count - a.count )
}
*/


function productsReducer( state: ProductCollection, { type }: ProductsAction ): any {
    switch( type ) {
        case ProductsActionType.SELECT: {
            return state
        }
    }
}

export function ProductsProvider({ children }: { children: ReactNode }) {
    const [ products, dispatch ] = useReducer( productsReducer, initialState )
    
    return (
        <ProductsContext.Provider value={ products }>
            <ProductsDispatchContext.Provider value={ dispatch }>
                { children }
            </ProductsDispatchContext.Provider>
        </ProductsContext.Provider>
    )
}