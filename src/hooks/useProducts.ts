import { useState, useEffect, useContext, useMemo } from "react"
import { CycleContext } from './../contexts/cycleContext';
import { SelectedContext, SelectedDispatchContext, SelectedActionTypes } from '../contexts/selectedContext';

type ProductCollection = Array<IProduct>

interface IUseProducts {
    products: ProductCollection
    toggleProduct: ( id: number ) => void
}

export default function useProducts( inquiries: Array<BuyerInquirySellerForWorldMapType>, num: number ): IUseProducts {
    const initialState = inquiries.reduce<ProductCollection>( productsReducer, [] ).sort( sortProductByCount )
    const [ products, setProducts ] = useState<ProductCollection>( initialState )
    const { selectedCountry } = useContext( SelectedContext )
    const dispatchSelected = useContext( SelectedDispatchContext )
    const { isPlaying } = useContext( CycleContext )

    const hasSelectedProduct = useMemo(() => hasSelected( products ), [ products ])
    const selectedProduct = useMemo(() => getSelected( products ), [ products ])

    const toggleProduct = ( id: number ) => {
        setProducts( prev => prev.map(( p: IProduct ) => {
            return { ...p, selected: ( p.selected && p.id === id ) ? false : ( p.id === id ) }
        }))
    }

    useEffect(() => {
        ( selectedProduct )
            ? dispatchSelected({ type: SelectedActionTypes.SELECT_PRODUCT, product: selectedProduct })
            : dispatchSelected({ type: SelectedActionTypes.DESELECT_PRODUCT })
    }, [ products ])

    useEffect(() => {
        if ( isPlaying && hasSelectedProduct ) setProducts( prev => deselect( prev ))
    }, [ isPlaying ])

    useEffect(() => {
        ( selectedCountry )
            ? setProducts( prev => toggleDisable( prev, selectedCountry.iso_a2 ).sort( sortProductByCount ))
            : setProducts( prev => enableAll( prev ).sort( sortProductByCount ))

    }, [ selectedCountry ])

    return {
        products,
        toggleProduct
    }
}

function toggleDisable( products: ProductCollection, iso_a2: string ): ProductCollection {
    return products.map(( p: IProduct ) => {
        const disabled = ( p.buyer !== iso_a2 && p.seller !== iso_a2 )
        return { ...p, disabled, selected: ( p.selected && !disabled ) ? true : false }
    })
}

function enableAll( products: ProductCollection ): ProductCollection {
    return products.map(( p: IProduct ) => ({ ...p, disabled: false }))
}

function deselect( products: ProductCollection ): ProductCollection {
    return products.map(( p: IProduct ) => ({ ...p, selected: false }) )
}

function hasProduct( products: ProductCollection, id: number ): boolean {
    return products.some(( p: IProduct ) => p.id === id )
}

function createProduct( products: ProductCollection, { id, name, image }: Product, seller: string, buyer: string ): ProductCollection {
    return [ ...products, { id, name, image, index: products.length, count: 1, selected: false, disabled: false, seller, buyer }]
}

function updateProduct( products: ProductCollection, id: number ): ProductCollection {
    return products.map(( p: IProduct ) => ( p.id === id ? { ...p, count: p.count + 1 } : p ))
}

function sortProductByCount( a: IProduct, b: IProduct ): number {
    return Number( a.disabled ) - Number( b.disabled ) || b.count - a.count
}

function getSelected( products: ProductCollection ): IProduct | undefined {
    return products.find(( product: IProduct ) => product.selected )
}

function hasSelected( products: ProductCollection ): boolean {
    return products.some(( product: IProduct ) => product.selected )
}

// inquiries to products colleciton ( create or update )
function productsReducer(
    acc: ProductCollection,
    { product, sellerCountry, buyerCountry }: BuyerInquirySellerForWorldMapType
): ProductCollection {
    return ( !hasProduct( acc, product.id )) ? createProduct( acc, product, sellerCountry, buyerCountry ) : updateProduct( acc, product.id )
}