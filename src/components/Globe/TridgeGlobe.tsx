import './TridgeGlobe.sass'
import { memo, useContext, useEffect, useRef } from "react"
// import { QueuesContext, QueuesDispatchContext, QueuesActionType } from "../../contexts/componentReadyContext"
// import { CycleContext, CycleDispatchContext, CycleActionTypes } from "../../contexts/cycleContext"
import useRAF from '../../hooks/useRAF'
import type { FeatureCollection } from 'geojson'

import ThreeGlobe from 'three-globe'

import useFetch from '../../hooks/useFetch'
import useCountry from '../../hooks/useCountry'
import { InquiryContext } from '../../contexts/inqContext'
import ThreeController from '../../utils/ThreeContorller'

function drawHexPolygons( globe: ThreeGlobe, countries: any ) {
	globe.hexPolygonsData( countries )
		.hexPolygonResolution( 3 )
		.hexPolygonMargin( .7 )
		.hexPolygonColor(() => '#3d3d3d' )
}

// export default function TridgeGlobe({ geojson }: Props) {
const TridgeGlobe = memo(() => {
    // const queues = useContext( QueuesContext )
    // const dispatch = useContext( QueuesDispatchContext )
    // const { isPlaying } = useContext( CycleContext )
    const GEO_JSON_URI: string = './custom.geojson'
    // const { data: geojson } = useFetch<FeatureCollection>( GEO_JSON_URI )
    const { data: geojson } = useFetch<FeatureCollection>( GEO_JSON_URI )
    
    const canvasDom = useRef< HTMLDivElement | null >( null )
    // const inquiryContext = useContext( InquiryContext )
    // const { countries } = useCountry( inquiryContext?.inquiries as Array<BuyerInquirySellerForWorldMapType> )

    console.log( 'check re rendering' )

    // useEffect(() => {
    //     if ( geojson ) {
    //         console.log( 'check re rendering in useEffect' )
    //         const { renderers, scene, cam, globe, interactionManager, init } = ThreeController();
    //         drawHexPolygons( globe, geojson.features )
    //         // append
    //         renderers.forEach( renderer => ( canvasDom.current ) ? canvasDom.current.appendChild( renderer.domElement ) : '' )
    //         init()
    //     }
    // }, [ geojson ])

    const { run } = useRAF()

    return (
        <div id="tridge-globe" ref={ canvasDom }>
        </div>
    )
})

export default TridgeGlobe