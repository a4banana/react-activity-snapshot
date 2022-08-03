import './ProductCardList.sass'
import { useContext } from 'react'
import type { MouseEvent } from 'react'
import ProductCard from './ProductCard'
import { InquiryContext } from '../../contexts/inqContext'
import useProducts from '../../hooks/useProducts'

export default function ProductCardList() {
    const PRODUCT_COUNT: number = 8
    const inquiries = useContext( InquiryContext )
    const { products, toggleProduct } = useProducts( inquiries!.inquiries, PRODUCT_COUNT )

    const clickHandler = ( event: MouseEvent<HTMLLIElement>, id: number ) => {
        toggleProduct( id )
    }

    const productCards = products.map( prod => <ProductCard key={ prod.id } product={ prod } clickHandler={ clickHandler } /> )
    
    return (
        <ul className="product-card-list">
            { productCards }
        </ul>
    )
}