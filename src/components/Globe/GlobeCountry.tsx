import { ThreeControllerType } from "../../utils/ThreeContorller"
import useCountry from '../../hooks/useCountry'
// import { InquiryContext } from '../../contexts/inquiryContext'
import { useEffect, useContext, MutableRefObject } from "react"
import { Feature } from "geojson"
import useInquiry from '../../hooks/useInquiry'

interface Props {
    threeController: ThreeControllerType
    geojson: Array<Feature>
    canvasDom: HTMLDivElement
}

const GlobeCountry = ({ threeController, geojson, canvasDom }: Props ) => {
    const { globe, drawCountryPoints, drawInquiryArcs, drawSelectedInquiries } = threeController
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

    return ( <></> )
}

export default GlobeCountry