import { useContext, useMemo } from 'react';

import { InquiryContext } from "../contexts/inquiryContext";
import { SelectedContext } from '../contexts/selectedContext';
import type { SelectState } from '../contexts/selectedContext'

interface State {
	inquiries: InquiryCollection
	selectedInquiries: InquiryCollection
	counts: InquiryCount
}

export default function useInquiry(): State {
	const { data } = useContext( InquiryContext )
	const selectState = useContext( SelectedContext )
	const { selectedCountry, selectedProduct } = selectState
	const inquiries = data.inquiries

	const selectedInquiries = useMemo<InquiryCollection>(() => {
		return filteredBySelected( inquiries, selectState )
	}, [ selectedCountry, selectedProduct ])

	const counts = useMemo<InquiryCount>(() => {
		return calcInquiryDataCount( inquiries )
	}, [ inquiries ])

	return {
		inquiries,
		selectedInquiries,
		counts
	}
}


const filteredBySelected = ( inquiries: InquiryCollection,
	{ selectedCountry, selectedProduct, selectBase }: SelectState
): InquiryCollection => {
	return inquiries.filter(( inquiry: Inquiry ) => {
		if ( selectedCountry && selectedProduct && selectBase === 'country' ) {
			return ( hasCountries( inquiry, selectedCountry ) && hasProduct( inquiry, selectedProduct ) ) 
		} else if ( selectedCountry && selectBase === 'country' ) {
			return ( hasCountries( inquiry, selectedCountry ) )
		} else if ( selectedProduct ) {
			return ( hasProduct( inquiry, selectedProduct ) )
		}
	})
}

const hasCountries = ({ buyerCountry, sellerCountry }: Inquiry, { iso_a2 }: CountryData ): boolean =>
	( buyerCountry === iso_a2 || sellerCountry === iso_a2 )

const hasProduct = ({ product }: Inquiry, { id }: IProduct ): boolean => product.id === id

const calcInquiryDataCount = ( inquiries: InquiryCollection ): InquiryCount => {
	return {
		inquiries: inquiries.length,
		sellers: getUniqLengthOfArray<InquiryCollection, Inquiry>( inquiries, c => c.sellerCountry ),
		buyers: getUniqLengthOfArray<InquiryCollection, Inquiry>( inquiries, c => c.buyerCountry ),
		products: getUniqLengthOfArray<InquiryCollection, Inquiry>( inquiries, c => c.product.name )
	}
}

const getUniqLengthOfArray = <T, U = any>( arr: T, filter: ( child: U ) => void ): number => {
	return [ ...new Set( arr.map( filter )) ].length
}