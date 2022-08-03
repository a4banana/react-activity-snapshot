import { useState, useRef, useEffect, useContext } from "react"
import type { MutableRefObject } from "react";
import type ThreeGlobe from 'three-globe';
import type { Feature } from "geojson"
import type { BufferGeometry, Mesh } from "three";
import { CycleDispatchContext, CycleActionTypes } from '../contexts/cycleContext';

interface IUseCountry {
    countries: CountryDataCollection
    buyerAndSellerGeoPositions: MutableRefObject<any>
    initCountries: ( geojson: Array<Feature>, globe: ThreeGlobe ) => void,
    toggleCountry: ( iso_a2: string ) => void
}

interface State {
    countries: CountryDataCollection
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

// useProducts Hook
export default function useCountry( inquiries: Array<BuyerInquirySellerForWorldMapType> ): IUseCountry {
    const [ countries, setCountries ] = useState<CountryDataCollection>([])
    const buyerAndSellerGeoPositions: MutableRefObject<BuyerAndSellerGeoPositionCollection> = useRef([])
    const dispatchCycle = useContext( CycleDispatchContext )
    
    function initCountries( geojson: Array<Feature>, globe: ThreeGlobe ) {
        const uniqCountries = countryDataByUniqCountries( inquiries )
        const reducedCountries = uniqCountries.reduce<CountryDataCollection>(
            ( acc: CountryDataCollection, iso_a2: string ): CountryDataCollection => {
            if ( !hasCountry( acc, iso_a2 ) ) {
                const geoInfo = getCountryGeoCoods( geojson, iso_a2, globe )
                if ( geoInfo ) {
                    const { name, position } = geoInfo
                    acc.push( createCountry( iso_a2, name, position ))
                }
            }
            return acc
        }, []);

        setCountries( reducedCountries )

        const buyerAndSellerReduce = (
            acc: BuyerAndSellerGeoPositionCollection,
            country: BuyerInquirySellerForWorldMapType
        ): BuyerAndSellerGeoPositionCollection => {
            const seller = getPosition( reducedCountries, country.sellerCountry )
            const buyer = getPosition( reducedCountries, country.buyerCountry )
            if (( seller && buyer ) && ( seller !== buyer )) {
                acc.push({ seller, buyer })
            }
            return acc
        }

        buyerAndSellerGeoPositions.current = inquiries.reduce( buyerAndSellerReduce, [])
    }

    useEffect(() => {
        ( hasSelected( countries ) )
            ? dispatchCycle({ type: CycleActionTypes.PAUSE })
            : dispatchCycle({ type: CycleActionTypes.PLAY })
    }, [ countries ])

    function toggleCountry( iso_a2: string ): void {
        setCountries( prev => toggleCountrySelect( prev, iso_a2 ) )
    }

    return {
        buyerAndSellerGeoPositions,
        countries,
        initCountries,
        toggleCountry
    }
}

const toggleCountrySelect = ( countries: CountryDataCollection, iso_a2: string ): CountryDataCollection =>
    countries.map(( country: CountryData ) => {
        return { ...country, selected: ( country.selected && country.iso_a2 === iso_a2 ) ? false : ( country.iso_a2 === iso_a2 ) }
    }
)

const hasSelected = ( countries: CountryDataCollection ): boolean => {
    return countries.some(( country: CountryData ) => country.selected )
}

const getPosition = ( countries: CountryDataCollection, iso_a2: string ): GeoPosition | null => {
    const res = countries.find(( country: CountryData ) => country.iso_a2 === iso_a2 )
    return res ? res.position : null
}

const countryDataByUniqCountries = ( inquiries: Array<BuyerInquirySellerForWorldMapType> ): Array<string> => {
    return [ ...new Set(
        [ ...new Set( inquiries.map( inq => inq.sellerCountry )),
            ...new Set( inquiries.map( inq => inq.buyerCountry ))]
    )]
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
	const feature: Feature | null = _getCountryByCode( features, iso_a2 )
	
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
	return features.find(( g: Feature ) => g.properties!.iso_a2 === iso_a2 ) || null
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