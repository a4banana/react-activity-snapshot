import './TridgeGlobe.sass'
import { memo, MutableRefObject, useContext, useEffect, useRef, useCallback } from "react"
// import { QueuesContext, QueuesDispatchContext, QueuesActionType } from "../../contexts/componentReadyContext"
import { CycleContext, CycleDispatchContext, CycleActionTypes } from "../../contexts/cycleContext"
import useRAF from '../../hooks/useRAF'
import type { FeatureCollection } from 'geojson'

import useFetch from '../../hooks/useFetch'
import useCountry from '../../hooks/useCountry'
import { InquiryContext } from '../../contexts/inqContext'
import ThreeController from '../../utils/ThreeContorller'
import type { ThreeControllerType } from '../../utils/ThreeContorller'

// export default function TridgeGlobe({ geojson }: Props) {
const TridgeGlobe = memo(() => {
    // const queues = useContext( QueuesContext )
    // const dispatch = useContext( QueuesDispatchContext )
    const GEO_JSON_URI: string = './custom.geojson'
    const { data: geojson } = useFetch<FeatureCollection>( GEO_JSON_URI )

    const canvasDom = useRef< HTMLDivElement | null >( null )
    const inquiryContext = useContext( InquiryContext )
    const { countries, buyerAndSellerGeoPositions,
        initCountries, toggleCountry } = useCountry( inquiryContext!.inquiries as Array<BuyerInquirySellerForWorldMapType> )
    const threeController: MutableRefObject<ThreeControllerType | null> = useRef( null )
    const raf = useRAF()

    const _countries = useRef( countries )
    const _isDrawn = useRef( false )
    
    useEffect(() => {
        threeController.current = ThreeController()
    }, [])

    // after fetch geojson
    useEffect(() => {
        if ( geojson && threeController.current ) {
            const { renderers, globe, render,
                drawCountryPolygon, init: initThreeController } = threeController.current;
            
            drawCountryPolygon( geojson )

            // append
            renderers.forEach( renderer => ( canvasDom.current ) ? canvasDom.current.appendChild( renderer.domElement ) : '' )

            // init threejs
            initThreeController()
            
            raf.addCallback( 'three controller rendering', render )

            /*
                ! setTimeout should be modified
            */
            setTimeout( () => { initCountries( geojson.features, globe )}, 1 )
        }
    }, [ geojson ])

    // after countries set
    // useEffect(() => {
    //     _countries.current = countries
    // }, [ countries ])
    
    useEffect(() => {
        // console.log( _countries )
        if ( countries.length && threeController.current && !_isDrawn.current ) {
            const { drawCountryPoints, drawInquiryArcs } = threeController.current
            drawCountryPoints( countries, canvasDom.current!, toggleCountry )
            drawInquiryArcs( buyerAndSellerGeoPositions.current )
            _isDrawn.current = true
        }
    }, [ countries ])
    
    return (
        <div id="tridge-globe" ref={ canvasDom }></div>
    )
})

export default TridgeGlobe