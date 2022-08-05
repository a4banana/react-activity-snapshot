import { ThreeControllerType } from "../../utils/ThreeContorller"
import useCountry from '../../hooks/useCountry'
import { useEffect, useContext } from "react"
import { Feature } from "geojson"
import { SelectedContext } from "../../contexts/selectedContext"

interface Props {
    threeController: ThreeControllerType
    geojson: Array<Feature>
    canvasDom: HTMLDivElement
}

const GlobeCountry = ({ threeController, geojson, canvasDom }: Props ) => {
    const { selectedCountry } = useContext( SelectedContext )
    const { globe,
        drawCountryPoints, drawInquiryArcs, drawSelectedInquiries, drawCountryBubble } = threeController
    const { countries, buyerAndSellerGeoPositions, countriesByProduct, buyerAndSellerGeoPositionsByProduct,
        toggleCountry } = useCountry({ globe, geojson })
        
    useEffect(() => {
        drawCountryPoints( countries, canvasDom, toggleCountry )
        drawInquiryArcs( buyerAndSellerGeoPositions.current )
    }, [])

    useEffect(() => {
        if ( countriesByProduct.length || buyerAndSellerGeoPositionsByProduct.current.length ) {
            drawSelectedInquiries( countriesByProduct, buyerAndSellerGeoPositionsByProduct.current, canvasDom, toggleCountry )
        }
    }, [ countriesByProduct, buyerAndSellerGeoPositionsByProduct ])

    useEffect(() => {
        if ( selectedCountry )
            drawCountryBubble( selectedCountry )
    }, [ selectedCountry ])

    return ( <></> )
}

export default GlobeCountry