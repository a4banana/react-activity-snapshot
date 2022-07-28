import './ProductCardList.sass'
import ProductCard from './ProductCard'
import { useContext } from 'react'
import { InquiryContext } from '../../contexts/inqContext'
import useProducts from '../../hooks/useProducts'

export default function ProductCardList() {
    const productCount = 9
    const inquiries = useContext( InquiryContext )
    const { products, toggleProduct } = useProducts( inquiries!.inquiries, productCount )

    const clickHandler = ( event: any, id: number ) => {
        toggleProduct( id )
    }

    const productCards = products.map( prod => <ProductCard key={ prod.id } product={ prod } clickHandler={ clickHandler } /> )
    
    return (
        <ul className="product-card-list">
            { productCards }
        </ul>
    )
}