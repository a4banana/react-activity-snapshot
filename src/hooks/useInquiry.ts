import { useContext, useMemo } from 'react';

import { InquiryContext } from "../contexts/inquiryContext";
import { SelectedContext } from '../contexts/selectedContext';

interface State {
    inquiries: BuyerInquirySellerForWorldMapType[]
    selectedInquiries: BuyerInquirySellerForWorldMapType[]
}

export default function useInquiry(): State {
    const { inquiries } = useContext( InquiryContext )!
    const { selectedCountry, selectedProduct, selectBase } = useContext( SelectedContext )

    const selectedInquiries = useMemo<BuyerInquirySellerForWorldMapType[]>(() => {
        return inquiries.filter(( inq: BuyerInquirySellerForWorldMapType ) => {
            if ( selectedCountry && selectedProduct && selectBase === 'country' ) {
                return (( inq.buyerCountry === selectedCountry.iso_a2 || inq.sellerCountry === selectedCountry.iso_a2 ) && inq.product.id === selectedProduct.id )
            }  else if ( selectedCountry && selectBase === 'country' ) {
                return ( inq.buyerCountry === selectedCountry.iso_a2 || inq.sellerCountry === selectedCountry.iso_a2 )
            } else if ( selectedProduct ) {
                return ( inq.product.id === selectedProduct.id )
            } else {
                return false
            }
        })
    }, [ selectedCountry, selectedProduct ])
    
    return {
        inquiries,
        selectedInquiries
    }
}