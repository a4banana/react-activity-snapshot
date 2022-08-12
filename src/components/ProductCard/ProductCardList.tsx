import './ProductCardList.sass'
import { useContext, useEffect } from 'react'
import type { MouseEvent } from 'react'
import ProductCard from './ProductCard'
import { InquiryContext } from '../../contexts/inquiryContext'
import useProducts from '../../hooks/useProducts'

export default function ProductCardList() {
    const { data } = useContext( InquiryContext )
    const { products, toggleProduct, putData } = useProducts()

    const clickHandler = ( event: MouseEvent<HTMLLIElement>, id: number ) => {
        toggleProduct( id )
    }

    useEffect(() => putData( data.inquiries ), [ data.inquiries ])

    const productCards = products.map(( prod,  i ) => {
        if ( i < 8 ) return <ProductCard key={ prod.id + i } product={ prod } index={ i } clickHandler={ clickHandler } />
    })

    return (
        <ul className="product-card-list">
            { productCards }
        </ul>
    )
}

