import { ThreeControllerType } from "../../utils/ThreeContorller"
import useCountry from '../../hooks/useCountry'
import { useEffect, useContext } from "react"
import { Feature } from "geojson"
import { SelectedContext } from "../../contexts/selectedContext"
import { CycleContext } from "../../contexts/cycleContext"
import usePrevious from "../../hooks/usePrevious"

interface Props {
    threeController: ThreeControllerType
    geojson: Array<Feature>
    canvasDom: HTMLDivElement
}

const GlobeCountry = ({ threeController, geojson, canvasDom }: Props ) => {
    const { cycle } = useContext( CycleContext )
    const { selectedCountry, selectedProduct, selectBase } = useContext( SelectedContext )
    const { globe,
        drawCountryPoints, drawInquiryArcs, drawSelectedInquiries,
        drawCountryBubble, removeSelectedInquiries } = threeController
    const { countries, buyerAndSellerGeoPositions, countriesByProduct,
        buyerAndSellerGeoPositionsByProduct,
        toggleCountry } = useCountry({ globe, geojson })
    const previousCountriesByProduct = usePrevious( countriesByProduct )
    const previousBuyerAndSellerGeoPositions = usePrevious( buyerAndSellerGeoPositionsByProduct.current )
    
    // default by cycles
    useEffect(() => {
        removeSelectedInquiries()
        drawCountryPoints( countries, canvasDom, toggleCountry )
        drawInquiryArcs( buyerAndSellerGeoPositions.current )
    }, [ cycle ])

    useEffect(() => {
        if ( countriesByProduct.length || buyerAndSellerGeoPositionsByProduct.current.length && selectedCountry ) {
            drawSelectedInquiries({
                countries: countriesByProduct,
                inquiries: buyerAndSellerGeoPositionsByProduct.current,
                selectBase,
                selectedCountry,
                dom: canvasDom,
                fn: toggleCountry
            })
        } else {
            if (( previousCountriesByProduct && previousBuyerAndSellerGeoPositions ) && ( previousCountriesByProduct.length || previousBuyerAndSellerGeoPositions.length ) )
                removeSelectedInquiries()
        }
    }, [ countriesByProduct, buyerAndSellerGeoPositionsByProduct ])

    useEffect(() => {
        if ( selectedCountry ) {
            ( selectedProduct ) ? drawCountryBubble( selectedCountry, selectedProduct ) : drawCountryBubble( selectedCountry );
        }
    }, [ selectedCountry, selectedProduct ])

    return ( <></> )
}

export default GlobeCountry