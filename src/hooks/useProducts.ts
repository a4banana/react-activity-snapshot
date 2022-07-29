import { useState } from "react"

type ProductCollection = Array<IProduct>

interface IUseProducts {
    products: ProductCollection
    toggleProduct: ( id: number ) => void
}

// useProducts Hook
export default function useProducts( inquiries: Array<BuyerInquirySellerForWorldMapType>, num: number ): IUseProducts {
    const initialState = inquiries.reduce<ProductCollection>( productsReducer, [] ).sort( sortProductByCount ).slice( 0, num )
    const [ products, setProducts ] = useState<ProductCollection>( initialState )

    const toggleProduct = ( id: number ) => {
        setProducts( prev => prev.map(( p: IProduct ) => {
            return { ...p, selected: ( p.selected && p.id === id ) ? false : ( p.id === id ) }
        }))
    }

    return {
        products,
        toggleProduct
    }
}


function hasProduct( products: ProductCollection, id: number ): boolean {
    return products.some(( p: IProduct ) => p.id === id )
}

function createProduct( products: ProductCollection, { id, name, image }: Product ): ProductCollection {
    return [ ...products, { id, name, image, index: products.length, count: 1, selected: false, disabled: false }]
}

function updateProduct( products: ProductCollection, id: number ): ProductCollection {
    return products.map( p => ( p.id === id ? { ...p, count: p.count + 1 } : p ))
}

function sortProductByCount( a: IProduct, b: IProduct ): number {
    return b.count - a.count 
}

// inquiries to products colleciton ( create or update )
function productsReducer(
    acc: ProductCollection,
    { product }: BuyerInquirySellerForWorldMapType ): ProductCollection {

    acc = ( !hasProduct( acc, product.id ))
        ? createProduct( acc, product ) : updateProduct( acc, product.id )
        
    return acc
}