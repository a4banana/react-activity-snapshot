import './TridgeGlobe.sass'
import { memo, MutableRefObject, useContext, useEffect, useRef } from "react"
// import { QueuesContext, QueuesDispatchContext, QueuesActionType } from "../../contexts/componentReadyContext"
// import { CycleContext, CycleDispatchContext, CycleActionTypes } from "../../contexts/cycleContext"
import useRAF from '../../hooks/useRAF'
import type { FeatureCollection } from 'geojson'

import ThreeGlobe from 'three-globe'

import useFetch from '../../hooks/useFetch'
import useCountry from '../../hooks/useCountry'
import { InquiryContext } from '../../contexts/inqContext'
import ThreeController from '../../utils/ThreeContorller'
import type { ThreeControllerType } from '../../utils/ThreeContorller'

// export default function TridgeGlobe({ geojson }: Props) {
const TridgeGlobe = memo(() => {
    // const queues = useContext( QueuesContext )
    // const dispatch = useContext( QueuesDispatchContext )
    // const { isPlaying } = useContext( CycleContext )
    const GEO_JSON_URI: string = './custom.geojson'
    const { data: geojson } = useFetch<FeatureCollection>( GEO_JSON_URI )
    
    const canvasDom = useRef< HTMLDivElement | null >( null )
    const inquiryContext = useContext( InquiryContext )
    const { initCountries, countries } = useCountry( inquiryContext!.inquiries as Array<BuyerInquirySellerForWorldMapType> )
    const threeController: MutableRefObject<ThreeControllerType | null> = useRef( null )
    
    useEffect(() => {
        threeController.current = ThreeController()

    }, [])

    // after fetch geojson
    useEffect(() => {
        if ( geojson && threeController.current ) {
            const { drawCountryPolygon, renderers, init, globe } = threeController.current;
            
            drawCountryPolygon( geojson )

            // append
            renderers.forEach( renderer => ( canvasDom.current ) ? canvasDom.current.appendChild( renderer.domElement ) : '' )

            // init threejs
            init()
            setTimeout( () => { initCountries( geojson.features, globe )}, 150 )
        }
    }, [ geojson ])

    // after countries set
    useEffect(() => {
        if ( countries.length && threeController.current ) {
            const { drawCountryPoints } = threeController.current
            drawCountryPoints( countries, canvasDom.current! )
        }
    }, [ countries ])
    
    const { run } = useRAF()

    return (
        <div id="tridge-globe" ref={ canvasDom }>
        </div>
    )
})

export default TridgeGlobe