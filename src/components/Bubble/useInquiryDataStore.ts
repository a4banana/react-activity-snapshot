import { defineStore } from 'pinia'
import { useQuery } from '@vue/apollo-composable'
import { InquiryQuery } from '@/utils/InquiryQuery'
import { ApolloQueryResult } from '@apollo/client/core';

export const useInquiryDataStore = defineStore( 'inquryData', {
	state: (): IInquiryDataStore => ({
		inquiries: [],
		cursorDate: null,
		selectedCountry: null,
		selectedProduct: null,
		selectBase: null,
		counts: {
			inquiries: 0,
			buyers: 0,
			sellers: 0,
			products: 0
		}
	}),
	getters: {
		// return inquiries via selected country and selected product
		inquiriesBySelected: ( state ): Array<BuyerInquirySellerForWorldMapType> => {
			return state.inquiries.filter(( inq: BuyerInquirySellerForWorldMapType ) => {
				if ( state.selectedCountry && state.selectedProduct && state.selectBase === 'country' ) {
					return (( inq.buyerCountry === state.selectedCountry.iso_a2 || inq.sellerCountry === state.selectedCountry.iso_a2 ) && inq.product.id === state.selectedProduct.id )
				} else if ( state.selectedCountry && state.selectBase === 'country' ) {
					return ( inq.buyerCountry === state.selectedCountry.iso_a2 || inq.sellerCountry === state.selectedCountry.iso_a2 )
				} else if ( state.selectedProduct ) {
					return ( inq.product.id === state.selectedProduct.id )
				} else {
					return false
				}
			})
		},

		inquiryCountBySelected(): number {
			return this.inquiriesBySelected.length
		},

		countryCodesBySelected(): Array<string> {
			let seller = [ ...new Set( this.inquiriesBySelected.map( inq => inq.sellerCountry ))]
			let buyer = [ ...new Set( this.inquiriesBySelected.map( inq => inq.buyerCountry ))]
			return [ ...seller, ...buyer ]
		},

		productsByCountry: ( state ) => {
			return ( iso_a2: string ): Array<string> => {
				const sellers = state.inquiries.filter(( inq: BuyerInquirySellerForWorldMapType ) => inq.sellerCountry === iso_a2 )
				const buyers = state.inquiries.filter(( inq: BuyerInquirySellerForWorldMapType ) => inq.buyerCountry === iso_a2 )
				return [ ...new Set( [ ...sellers, ...buyers ].map(( inq: BuyerInquirySellerForWorldMapType ) => inq.product.name ))]
			}
		}
	},
	actions: {
		// fetch Inquiry Data via graphQL
		async fetchInquiryData(): Promise<boolean> {
			const { onResult } = useQuery( InquiryQuery, { startDate: this.cursorDate }, { errorPolicy: 'all' })
			return new Promise( resolve => onResult(( result: ApolloQueryResult<any> ) => {
				const { inquiries, cursorDate } = result.data.buyerInquirySellerForWorldMap
				this.cursorDate = cursorDate ? cursorDate : null
				this.inquiries = inquiries
				resolve( true )
			}))
		},
		
		// calc inquiry data's count info
		calcInquiryDataCount(): void {
			this.counts.inquiries = this.inquiries.length
			this.counts.sellers = [ ...new Set( this.inquiries.map( v => v.sellerCountry ))].length
			this.counts.buyers = [ ...new Set( this.inquiries.map( v => v.buyerCountry ))].length
			this.counts.products = [ ...new Set( this.inquiries.map( v => v.product.name ))].length
		},

		// toggle select | deselect country
		toggleCountry( country: CountryData ): void {
			this.selectedCountry = ( this.selectedCountry !== country ) ? country : null;
			if ( this.selectedCountry !== null && this.selectedProduct === null ) this.selectBase = 'country'
		},

		// toggle select | deselect product
		toggleProduct( product: IProduct ): void {
			this.selectedProduct = ( this.selectedProduct !== product ) ? product : null;
			if ( this.selectedCountry === null && this.selectedProduct !== null ) this.selectBase = 'product'
		},

		resetSelected(): void {
			this.deselectCountry()
			this.deselectProduct()
		},

		deselectCountry(): void {
			this.selectedCountry = null
		},

		deselectProduct(): void {
			this.selectedProduct = null
		},

		getProductsByCountry( iso_a2: string ): Array<string> {
			const sellers = this.inquiries.filter(( inq: BuyerInquirySellerForWorldMapType ) => inq.sellerCountry === iso_a2 )
			const buyers = this.inquiries.filter(( inq: BuyerInquirySellerForWorldMapType ) => inq.buyerCountry === iso_a2 )
			return [ ...new Set( [ ...sellers, ...buyers ].map(( inq: BuyerInquirySellerForWorldMapType ) => inq.product.name ))]
		}
	}
})