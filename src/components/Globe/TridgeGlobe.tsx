import './TridgeGlobe.sass'
import { memo, useContext, useEffect, useRef } from "react"
import { QueuesContext, QueuesDispatchContext, QueuesActionType } from "../../contexts/componentReadyContext"
import { CycleContext, CycleDispatchContext, CycleActionTypes } from "../../contexts/cycleContext"
import useRAF from '../../hooks/useRAF'
import type { FeatureCollection } from 'geojson'

import { Scene, WebGLRenderer, PerspectiveCamera,
	AmbientLight, DirectionalLight, Group, Mesh
	} from 'three'
import ThreeGlobe from 'three-globe'
import { InteractionManager } from 'three.interactive'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer'
import { gsap } from 'gsap'
import { chunk } from 'lodash-es'
import { getPixelsPerDegree } from '../../utils/PolarAndCartesian'

import useFetch from '../../hooks/useFetch'

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
    const { data: geojson, isLoading } = useFetch<FeatureCollection>( GEO_JSON_URI )

    const SCREEN_WIDTH: number = 1184
    const SCREEN_HEIGHT: number = 666
    const BLUR_ALPHA: number = 0.3
    const BLUR_RADIUS: number = getPixelsPerDegree( 0.8 )
    const FOCUS_RADIUS: number = getPixelsPerDegree( 1.2 )

    const canvasDom = useRef< HTMLDivElement | null >( null )
    const webGLRenderer = new WebGLRenderer({ antialias: true, alpha: true })
    const css3DRenderer = new CSS3DRenderer()
    const renderer: Array<WebGLRenderer | CSS3DRenderer> = [ webGLRenderer, css3DRenderer ]
    const scene: Scene = new Scene()
    const cam: PerspectiveCamera = new PerspectiveCamera()
    const globe: ThreeGlobe = new ThreeGlobe()
    const obControl: OrbitControls = new OrbitControls( cam, webGLRenderer.domElement )
    const interactionManager: InteractionManager = new InteractionManager( webGLRenderer, cam, webGLRenderer.domElement, undefined )

    // default point and line group
    const pointGroup: Group = new Group()
    const lineGroup: Group = new Group()
    const textGroup: Group = new Group()
    const htmlGroup: Group = new Group()

    // focused point and line group
    const focusedLineGroup: Group = new Group()
    const focusedPointGroup: Group = new Group()
    console.log( 'dd???' )
    if ( geojson ) {
        console.log( 'render globe' )
        drawHexPolygons( globe, geojson.features )
    }

    scene.add( globe )
	scene.add( new AmbientLight( 0xFFFFFF, 1 ))
	scene.add( new DirectionalLight( 0xFFFFFF, .5 ))
	scene.add( lineGroup )
	scene.add( pointGroup )
	scene.add( textGroup )
	scene.add( htmlGroup )
	cam.aspect = SCREEN_WIDTH / SCREEN_HEIGHT
	cam.updateProjectionMatrix()
	cam.position.z = 270

	scene.add( focusedLineGroup )
	scene.add( focusedPointGroup )

	webGLRenderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT )
	css3DRenderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT )
	css3DRenderer.domElement.style.position = 'absolute'
	css3DRenderer.domElement.style.top = '0px'
	css3DRenderer.domElement.style.left = '0px'
	css3DRenderer.domElement.style.pointerEvents = 'none'

	obControl.panSpeed = 0.33
	obControl.zoomSpeed = 0.33
	obControl.autoRotate = true
	obControl.minDistance = 200
	obControl.maxDistance = 500
	obControl.autoRotateSpeed = 0.125

    const { run } = useRAF()

    function globeFrame( timestamp: number ): void {
        obControl.update()
        interactionManager.update()
        renderer.forEach( r => r.render( scene, cam ) )
        // webGLRenderer.render( scene, cam )
        // css3DRenderer.render( scene, cam )
        // updatePath()
        // updatePoint()
        // htmlGroup.children.forEach( c => c.lookAt( cam.position ) )
        window.requestAnimationFrame( globeFrame )
    }

    useEffect(() => {
        if ( canvasDom.current ) {
            console.log( 'append!' )
            canvasDom.current.appendChild( webGLRenderer.domElement )
            canvasDom.current.appendChild( css3DRenderer.domElement )
            window.requestAnimationFrame( globeFrame )
        }
    }, [])

    return (
        <div id="tridge-globe" ref={ canvasDom }>
        </div>
    )
})

export default TridgeGlobe