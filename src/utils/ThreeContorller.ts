import { Scene, WebGLRenderer, PerspectiveCamera,
	AmbientLight, DirectionalLight, Group } from 'three'
import ThreeGlobe from 'three-globe'
import { InteractionManager } from 'three.interactive'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer'
import type { FeatureCollection } from 'geojson'

import CountryPoint from './DrawCountryPoint'
import InquiryArc from './DrawInquiryArc'

type Rendereres = Array<WebGLRenderer | CSS3DRenderer>

interface Callback<T = any, U = void> {
	( arg?: T ): U
}

export type ThreeControllerType = {
	renderers: Rendereres
	scene: Scene
	cam: PerspectiveCamera
	globe: ThreeGlobe
	interactionManager: InteractionManager
	init: () => void
	drawInquiryArcs: ( inqs: { buyer: GeoPosition, seller: GeoPosition }[] )=> void
	drawCountryPolygon: ( geojson: FeatureCollection ) => void
	drawCountryPoints: ( countries: CountryDataCollection, dom: HTMLDivElement, fn: Callback ) => void
	render: ( isPlaying?: boolean ) => void
}

export default function ThreeController(): ThreeControllerType {
	console.log( 'Three Controller Init' )
	const LIGHT_COLOR: number = 0xFFFFFF
	const SCREEN_WIDTH: number = 1184
    const SCREEN_HEIGHT: number = 666
	const COUNTRY_POLYGON_COLOR: string = '#3D3D3D'
    // const BLUR_ALPHA: number = 0.3
    // const BLUR_RADIUS: number = getPixelsPerDegree( 0.8 )
    // const FOCUS_RADIUS: number = getPixelsPerDegree( 1.2 )
	const CAM_INITIAL_Z: number = 270

	const webGLRenderer = new WebGLRenderer({ antialias: true, alpha: true })
	const css3DRenderer = new CSS3DRenderer()
	const renderers: Rendereres = [ webGLRenderer, css3DRenderer ]
	const scene: Scene = new Scene()
	const cam: PerspectiveCamera = new PerspectiveCamera()
	const globe: ThreeGlobe = new ThreeGlobe()
	const obControl: OrbitControls = new OrbitControls( cam, webGLRenderer.domElement )
	const interactionManager: InteractionManager = new InteractionManager( webGLRenderer, cam, webGLRenderer.domElement, undefined )
	
	const countryPoint = CountryPoint( interactionManager, cam, obControl )
	const { drawCountryPoint } = countryPoint
	const inquiryArc = InquiryArc()
	const { drawInquiryArc } = inquiryArc
	
	const pointGroup: Group = new Group()
	const lineGroup: Group = new Group()

	function render( isPlaying?: boolean ): void {
		obControl.update()
		interactionManager.update()
		renderers.forEach( r => r.render( scene, cam ) )
		webGLRenderer.render( scene, cam )
		css3DRenderer.render( scene, cam )
		
		if ( isPlaying ) {
			updatePath( lineGroup )
			// updatePoint()
			// htmlGroup.children.forEach( c => c.lookAt( cam.position ) )
		}
	}

	function init(): void {
		scene.add( globe )
		scene.add( new AmbientLight( LIGHT_COLOR, 1 ))
		scene.add( new DirectionalLight( LIGHT_COLOR, .5 ))
		
		// set Camera
		setCamera( cam, SCREEN_WIDTH, SCREEN_HEIGHT, CAM_INITIAL_Z )
		// set OrbitControl
		setOrbitControl( obControl, {
			autoRotate: false, 
			autoRotateSpeed: 0.125,
			minDistance: 200, 
			maxDistance: 500,
			panSpeed: 0.33, 
			zoomSpeed: 0.33
		})

		// scene.add( focusedLineGroup )
		// scene.add( focusedPointGroup )
		scene.add( pointGroup )
		scene.add( lineGroup )

		// init and set Renderer
		setRenderersSize( renderers, SCREEN_WIDTH, SCREEN_HEIGHT )
		initCSS3DRenderer( css3DRenderer )
		// window.requestAnimationFrame( render )
		render()
	}

	const drawCountryPoints = ( countries: CountryDataCollection, dom: HTMLDivElement, fn: Callback ) => {
		pointGroup.children = []
		countries.forEach(( country: CountryData ) => pointGroup.add( drawCountryPoint( country, dom, fn )))
	}

	const drawInquiryArcs = ( inqs: { buyer: GeoPosition, seller: GeoPosition }[]) => {
		lineGroup.children = []
		inqs.forEach(({ buyer, seller }) => lineGroup.add( drawInquiryArc( buyer, seller )))
	}
	
	const drawCountryPolygon = ( geojson: FeatureCollection ): void => drawHexPolygons( globe, geojson, COUNTRY_POLYGON_COLOR )

	return {
		renderers, scene, cam, globe, interactionManager,
		init, drawCountryPolygon, drawCountryPoints, drawInquiryArcs, render
	}
}

const drawHexPolygons = ( globe: ThreeGlobe, { features }: FeatureCollection, color: string ): void => {
	globe.hexPolygonsData( features )
		.hexPolygonResolution( 3 )
		.hexPolygonMargin( .7 )
		.hexPolygonColor( () => color )
}

const setCamera = ( cam: PerspectiveCamera, width: number, height: number, CAM_INITIAL_Z: number ): void => {
	cam.aspect = width / height
	cam.updateProjectionMatrix()
	cam.position.z = CAM_INITIAL_Z
}

const setOrbitControl = ( ob: OrbitControls, opts: { [ key: string ]: unknown } ): void => {
	// @ts-ignore // OrbitControls has no Type
	Object.entries( opts ).map(([ key, value ]) => ob[ key ] = value )
}

const setRenderersSize = ( renderes: Rendereres, width: number, height: number ): void => {
	renderes.forEach( renderer => renderer.setSize( width, height ) )
}

const initCSS3DRenderer = ( css3DRenderer: CSS3DRenderer ): void => {
	css3DRenderer.domElement.style.position = 'absolute'
	css3DRenderer.domElement.style.top = '0px'
	css3DRenderer.domElement.style.left = '0px'
	css3DRenderer.domElement.style.pointerEvents = 'none'
}

function updatePath( lineGroup: Group ): void {
	lineGroup.children.forEach( child => {
		// @ts-ignore
		child.material.uniforms.dashTranslate.value += 0.0015
	})
}