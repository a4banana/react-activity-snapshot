import { useMemo, useState, useRef, MutableRefObject } from "react"
import type ThreeGlobe from 'three-globe';
import type { Feature, FeatureCollection } from "geojson"

interface IUseCountry {
    countries: CountryDataCollection
    initCountries: ( geojson: Array<Feature>, globe: ThreeGlobe ) => void
}

interface State {
    countries: CountryDataCollection
}

const initialState: State = {
    countries: []
}

interface GeoJSONProeperties {
    [ name: string ]: any
}

interface Feature {
    __threeObj: any
    properties: GeoJSONProeperties
}

// useProducts Hook
export default function useCountry( inquiries: Array<BuyerInquirySellerForWorldMapType> ): IUseCountry {
    const [ countries, setCountries ] = useState<CountryDataCollection>([])

    function initCountries( geojson: Array<Feature>, globe: ThreeGlobe ) {
        const uniqCountries = countryDataByUniqCountries( inquiries )
        
        // console.log( geojson )
        const _countries = uniqCountries.reduce<CountryDataCollection>(
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

        setCountries( _countries )
    }

    return {
        countries,
        initCountries
    }
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

type CountryGeoCoods = {
    position: GeoPosition
    name: string
}

const getCountryGeoCoods = ( features: Array<Feature>, iso_a2: string, globe: ThreeGlobe): CountryGeoCoods | void => {
	const feature: Feature | null = _getCountryByCode( features, iso_a2 )

	if ( feature && _hasFeatureAndThreeObj( feature, iso_a2 ) ) {
		const { name } = feature.properties
		const { x, y, z } = feature.__threeObj.geometry.boundingSphere.center

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
	const country = features.find(( g: Feature ) => g.properties!.iso_a2 === iso_a2 ) || null
	return country
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