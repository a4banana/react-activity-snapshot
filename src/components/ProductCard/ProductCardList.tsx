import './ProductCardList.sass'
import ProductCard from './ProductCard'
import { useContext } from 'react'
import { InquiryContext } from '../../contexts/inqContext'

export default function ProductCardList() {
    const inquiries = InquiryContext

    console.log( inquiries )
    
    return (
        <ul className="product-card-list">
            
        </ul>
    )
}