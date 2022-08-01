import { useMemo, useState } from "react"

type CountryDataCollection = Array<CountryData>

interface IUseCountry {
    countries: CountryDataCollection | undefined
}

// const initialState: CountryState = {
//     countries: []
// }

// useProducts Hook
export default function useCountry( inquiries: Array<BuyerInquirySellerForWorldMapType> ): IUseCountry {
    // const initialState = inquiries.reduce<ProductCollection>( productsReducer, [] ).sort( sortProductByCount ).slice( 0, num )
    // const [ countries, setCountries ] = useState()

    const countries = useMemo(() => inquiries, [ inquiries ])
    // console.log( inquiries )
    // setCountries( inquiries );

    // const toggleProduct = ( id: number ) => {
    //     setProducts( prev => prev.map(( p: IProduct ) => {
    //         return { ...p, selected: ( p.selected && p.id === id ) ? false : ( p.id === id ) }
    //     }))
    // }

    return {
        countries
    }
}