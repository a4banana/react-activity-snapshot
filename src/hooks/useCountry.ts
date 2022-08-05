import { useState, useRef, useEffect, useContext, useMemo } from "react"
import type { MutableRefObject } from "react";
import { SelectedDispatchContext, SelectedActionTypes, SelectedContext } from '../contexts/selectedContext';
import { CycleContext } from '../contexts/cycleContext';
import type ThreeGlobe from 'three-globe';
import type { Feature } from "geojson"
import type { BufferGeometry, Mesh } from "three";
import useInquiry from './useInquiry'

interface Props {
    globe: ThreeGlobe
    geojson: Array<Feature> 
}

interface UseCountry {
    countries: CountryDataCollection
    countriesByProduct: CountryDataCollection
    buyerAndSellerGeoPositions: MutableRefObject<BuyerAndSellerGeoPositionCollection>
    buyerAndSellerGeoPositionsByProduct: MutableRefObject<BuyerAndSellerGeoPositionCollection>
    toggleCountry: ( iso_a2: string ) => void
}

type GeoJsonProperties = {
    [ name: string ]: any
}

interface FeatureWithThree extends Feature {
    __threeObj: Mesh & { geometry: BufferGeometry }
}

type CountryGeoCoods = {
    position: GeoPosition
    name: string
}

interface BuyerAndSellerGeoPosition {
    buyer: GeoPosition
    seller: GeoPosition
}

type BuyerAndSellerGeoPositionCollection = Array<BuyerAndSellerGeoPosition>

export default function useCountry({ globe, geojson }: Props ): UseCountry {
    const { inquiries, selectedInquiries } = useInquiry()
    const initialState = getCountryDataCollection( countryDataByUniqCountries( inquiries ), geojson, globe )

    const [ countries, setCountries ] = useState<CountryDataCollection>( initialState )
    const [ countriesByProduct, setCountriesByProduct ] = useState<CountryDataCollection>([])

    const buyerAndSellerGeoPositions: MutableRefObject<BuyerAndSellerGeoPositionCollection> = useRef(getGeoPositionsByBuyerAndSeller( inquiries, countries ))
    const buyerAndSellerGeoPositionsByProduct: MutableRefObject<BuyerAndSellerGeoPositionCollection> = useRef([])
    const dispatchSelected = useContext( SelectedDispatchContext )
    const { isPlaying } = useContext( CycleContext )

    const hasSelectedCountry = useMemo(() => hasSelected( countries ), [ countries ])
    const selectedCountry = useMemo(() => getSelected( countries ), [ countries ])
    
    useEffect(() => {
        ( selectedCountry )
            ? dispatchSelected({ type: SelectedActionTypes.SELECT_COUNTRY, country: selectedCountry })
            : dispatchSelected({ type: SelectedActionTypes.DESELECT_COUNTRY })
    }, [ countries ])

    useEffect(() => {
        if ( isPlaying && hasSelectedCountry ) setCountries( prev => deselect( prev ))
    }, [ isPlaying ])

    useEffect(() => {
        console.log( selectedInquiries )
        if ( selectedInquiries.length ) {
            const uniq = countryDataByUniqCountries( selectedInquiries );
            console.log( uniq )
            setCountriesByProduct(() => getCountryDataCollection( countryDataByUniqCountries( selectedInquiries ), geojson, globe) )
            buyerAndSellerGeoPositionsByProduct.current = getGeoPositionsByBuyerAndSeller( selectedInquiries, countries )
        } else {
            setCountriesByProduct(() => [])
        }
    }, [ selectedInquiries ])

    function toggleCountry( iso_a2: string ): void {
        setCountries( prev => toggleCountrySelect( prev, iso_a2 ) )
    }

    return {
        buyerAndSellerGeoPositions,
        countries,
        countriesByProduct,
        buyerAndSellerGeoPositionsByProduct,
        toggleCountry
    }
}

const deselect = ( countries: CountryDataCollection ): CountryDataCollection => {
    return countries.map(( country: CountryData ) => ({ ...country, selected: false }))
}

const toggleCountrySelect = ( countries: CountryDataCollection, iso_a2: string ): CountryDataCollection =>
    countries.map(( country: CountryData ) => {
        return { ...country, selected: ( country.selected && country.iso_a2 === iso_a2 ) ? false : ( country.iso_a2 === iso_a2 ) }
    }
)

const getSelected = ( countries: CountryDataCollection ): CountryData | undefined => {
    return countries.find(( country: CountryData ) => country.selected )
}

const getPosition = ( countries: CountryDataCollection, iso_a2: string ): GeoPosition | undefined => {
    const res = countries.find(( country: CountryData ) => country.iso_a2 === iso_a2 )
    return res ? res.position : undefined
}

const countryDataByUniqCountries = ( inquiries: Array<BuyerInquirySellerForWorldMapType> ): Array<string> => {
    return [ ...new Set(
        [ ...new Set( inquiries.map( inq => inq.sellerCountry )),
            ...new Set( inquiries.map( inq => inq.buyerCountry ))]
    )]
}

const getGeoPositionsByBuyerAndSeller = ( inquiries: BuyerInquirySellerForWorldMapType[], arr: CountryDataCollection ): BuyerAndSellerGeoPositionCollection =>
    inquiries.reduce((
            acc: BuyerAndSellerGeoPositionCollection,
            country: BuyerInquirySellerForWorldMapType
    ): BuyerAndSellerGeoPositionCollection => {
        const seller = getPosition( arr, country.sellerCountry )
        const buyer = getPosition( arr, country.buyerCountry )
        if (( seller && buyer ) && ( seller !== buyer )) {
            acc.push({ seller, buyer })
        }
        return acc
    }, [])


const getCountryDataCollection = ( arr: string[], geojson: Array<Feature>, globe: ThreeGlobe ): CountryDataCollection => {
    return arr.reduce(( acc: CountryDataCollection, iso_a2: string ) => {
        if ( !hasCountry( acc, iso_a2 ) ) {
            const geoInfo = getCountryGeoCoods( geojson, iso_a2, globe )
            if ( geoInfo ) {
                const { name, position } = geoInfo
                acc.push( createCountry( iso_a2, name, position ))
            }
        }
        return acc
    }, [])
}

const hasSelected = ( countries: CountryDataCollection ): boolean => {
    return countries.some(( country: CountryData ) => country.selected )
}

const hasCountry = ( countries: CountryDataCollection, iso_a2: string ): boolean => {
    return countries.some( country => country.iso_a2 === iso_a2 )
}

const createCountry = ( iso_a2: string, name: string, position: GeoPosition ): CountryData => {
    const selected = false
    const disabled = false
    return { iso_a2, name, position, selected, disabled }
}

const getCountryGeoCoods = ( features: Array<Feature>, iso_a2: string, globe: ThreeGlobe): CountryGeoCoods | void => {
	const feature: Feature | undefined = _getCountryByCode( features, iso_a2 )
	
    if ( feature && _hasFeatureAndThreeObj( feature, iso_a2 ) ) {
		const { name } = feature.properties as GeoJsonProperties
		const { x, y, z } = ( feature as FeatureWithThree ).__threeObj.geometry.boundingSphere!.center

		if ( _isValidCoord( { x, y, z }, iso_a2, name )) {
			const { lat, lng, altitude: alt } = globe.toGeoCoords({ x, y, z })
			const position = { lat, lng, alt }
			return {
				position, name
			}
		}
	}
}

const _getCountryByCode = ( features: Array<Feature>, iso_a2: string ) => {
	return features.find(( g: Feature ) => g.properties!.iso_a2 === iso_a2 ) || undefined
}

const _hasFeatureAndThreeObj = ( feature: Feature, iso_a2: string ): boolean => {
	if ( feature && Object.getOwnPropertyNames( feature ).includes( '__threeObj' ) ) {
		return true
	} else {
		console.error( iso_a2 + ' data not found in geojson' )
		return false
	}
}

const _isValidCoord = ( pos: { x: number, y: number, z: number }, iso_a2: string, name: string ): boolean => {
	if ( pos.x !== 0 && pos.y !== 0 && pos.z !== 0 ) {
		return true
	} else {
		console.error( iso_a2 + ' is wrong position -- ' + name )
		return false
	}
}