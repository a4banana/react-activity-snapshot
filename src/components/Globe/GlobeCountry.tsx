import { ThreeControllerType } from "../../utils/ThreeContorller"
import useCountry from '../../hooks/useCountry'
import { useEffect, useContext } from "react"
import { Feature } from "geojson"
import { SelectedContext } from "../../contexts/selectedContext"
import { CycleContext } from "../../contexts/cycleContext"

interface Props {
    threeController: ThreeControllerType
    geojson: Array<Feature>
    canvasDom: HTMLDivElement
}

const GlobeCountry = ({ threeController, geojson, canvasDom }: Props ) => {
    const { cycle } = useContext( CycleContext )
    const { selectedCountry, selectBase } = useContext( SelectedContext )
    const { globe,
        drawCountryPoints, drawInquiryArcs, drawSelectedInquiries, drawCountryBubble, removeSelectedInquiries } = threeController
    const { countries, buyerAndSellerGeoPositions, countriesByProduct, buyerAndSellerGeoPositionsByProduct,
        toggleCountry } = useCountry({ globe, geojson })
    
    // default by cycles
    useEffect(() => {
        drawCountryPoints( countries, canvasDom, toggleCountry )
        drawInquiryArcs( buyerAndSellerGeoPositions.current )
    }, [ cycle ])

    useEffect(() => {
        if ( countriesByProduct.length || buyerAndSellerGeoPositionsByProduct.current.length && selectedCountry ) {
            drawSelectedInquiries( countriesByProduct, buyerAndSellerGeoPositionsByProduct.current, selectBase as string, canvasDom, toggleCountry, selectedCountry as CountryData )
        } else {
            removeSelectedInquiries()
        }
    }, [ countriesByProduct, buyerAndSellerGeoPositionsByProduct ])

    useEffect(() => {
        if ( selectedCountry ) {
            drawCountryBubble( selectedCountry )
        }
    }, [ selectedCountry ])

    return ( <></> )
}

export default GlobeCountry

/**
 * 1. country base 
 * > country select >> 
 * > product select 
 */