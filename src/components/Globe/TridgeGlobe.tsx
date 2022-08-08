import './TridgeGlobe.sass'
import { memo, useContext, useEffect, useRef } from "react"

import GlobeCountry from './GlobeCountry'
import { QueuesDispatchContext, QueuesActionType } from "../../contexts/queuesContext"
import useRAF from '../../hooks/useRAF'
import type { FeatureCollection } from 'geojson'

import ThreeController from '../../utils/ThreeContorller'
import type { ThreeControllerType } from '../../utils/ThreeContorller'

interface Props {
    geojson: FeatureCollection
}

const TridgeGlobe = memo(({ geojson }: Props) => {
    const dispatchQueues = useContext( QueuesDispatchContext )
    const canvasDom = useRef<HTMLDivElement | null>( null )
    const threeController = useRef<ThreeControllerType | null>( null )
    const { addCallback } = useRAF()


    useEffect(() => {
        // add queue
        dispatchQueues({ type: QueuesActionType.ADD_QUEUE, key: 'three-init' })
        threeController.current = ThreeController( geojson )
        const { renderers, render, init } = threeController.current
        init()
        renderers.forEach( renderer => ( canvasDom.current ) ? canvasDom.current.appendChild( renderer.domElement ) : false )
        addCallback( 'three controller rendering', render )
    }, [])
    
    // rendering after queues ready
    return (
        <div id="tridge-globe" ref={ canvasDom }>
            { ( threeController.current && canvasDom.current ) &&
                <GlobeCountry threeController={ threeController.current } geojson={ geojson.features } canvasDom={ canvasDom.current } />
            }
        </div>
    )
})

export default TridgeGlobe