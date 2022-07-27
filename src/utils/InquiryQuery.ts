import { gql } from "@apollo/client"

const InquiryQuery = gql`query buyerInquirySellerForWorldMap( $startDate: DateTime ) {
	buyerInquirySellerForWorldMap( startDate: $startDate ) {
		cursorDate
		count
		inquiries {
			id
			sellerCountry
			buyerCountry
			product {
				id
				name
				image
			}
			createdAt
		}
	}
}`

export { InquiryQuery }