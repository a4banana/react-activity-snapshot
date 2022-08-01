import { Scene, WebGLRenderer, PerspectiveCamera,
	AmbientLight, DirectionalLight, Group, Mesh, Camera
	} from 'three'
import ThreeGlobe from 'three-globe'
import { InteractionManager } from 'three.interactive'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer'
import { gsap } from 'gsap'
import { chunk } from 'lodash-es'
import { getPixelsPerDegree } from './PolarAndCartesian'
import { FeatureCollection } from 'geojson'

import CountryPoint from './DrawCountryPoint'

type Rendereres = Array<WebGLRenderer | CSS3DRenderer>

export type ThreeControllerType = {
	renderers: Rendereres
	scene: Scene
	cam: PerspectiveCamera
	globe: ThreeGlobe
	interactionManager: InteractionManager
	init: () => void
	drawCountryPolygon: ( geojson: FeatureCollection ) => void
	drawCountryPoints: ( countries: CountryDataCollection, dom: HTMLDivElement ) => void
}

export default function ThreeController(): ThreeControllerType {
	const LIGHT_COLOR: number = 0xFFFFFF
	const SCREEN_WIDTH: number = 1184
    const SCREEN_HEIGHT: number = 666
    const BLUR_ALPHA: number = 0.3
    const BLUR_RADIUS: number = getPixelsPerDegree( 0.8 )
    const FOCUS_RADIUS: number = getPixelsPerDegree( 1.2 )
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
	const { drawCountryPoint } = countryPoint;
	const pointGroup: Group = new Group()

	function render( timestamp: number ): void {
		obControl.update()
		interactionManager.update()
		renderers.forEach( r => r.render( scene, cam ) )
		webGLRenderer.render( scene, cam )
		css3DRenderer.render( scene, cam )
		// updatePath()
		// updatePoint()
		// htmlGroup.children.forEach( c => c.lookAt( cam.position ) )
		window.requestAnimationFrame( render )
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
		// scene.add( focusedPointGroup 
		scene.add( pointGroup )

		// init and set Renderer
		setRenderersSize( renderers, SCREEN_WIDTH, SCREEN_HEIGHT )
		initCSS3DRenderer( css3DRenderer )

		window.requestAnimationFrame( render )
	}

	const drawCountryPoints = ( countries: CountryDataCollection, dom: HTMLDivElement ) => {
		pointGroup.children = []
		countries.forEach(( country: CountryData ) => pointGroup.add( drawCountryPoint( country, dom )))
	}

	const drawCountryPolygon = ( geojson: FeatureCollection ): void => drawHexPolygons( globe, geojson )

	return {
		renderers, scene, cam, globe, interactionManager,
		init, drawCountryPolygon, drawCountryPoints
	}
}

function generateArcsAndPoints( globe: ThreeGlobe, countries: CountryDataCollection, pointGroup: Group ) {
	// // remove points from interaction manager
	// pointGroup.children.forEach( child => interactionManager.remove( child ))
	// // reset Three Point Group
	pointGroup.children = []
	// // reset current point Data
	// resetCountries()
	// // reest Three Line Group
	// lineGroup.children = []
	// htmlGroup.children.forEach( cssobj => htmlGroup.remove( cssobj ) )
	// htmlGroup.children = []

	// const sellers = [ ...new Set( inquiries.value.map( inq => inq.sellerCountry ))]
	// const buyers = [ ...new Set( inquiries.value.map( inq => inq.buyerCountry ))]

	// sellers.forEach( country => createOrUpdateCountry( country ))
	// buyers.forEach( country => createOrUpdateCountry( country ))

	countries.forEach(( country: CountryData ) => pointGroup.add( drawCountryPoint( country, dom.value ) ))

	// arc
	// const seg = 3
	// const gap = .5
	// const segTime = CycleProperties.Speed / seg
	// const segDelay = segTime * gap
	// const segDuration = ( i: number ) => segDelay * i * 2;
	
	// const chunkCount: number = Math.ceil( inquiries.value.length / seg )
	// const chunks = chunk( inquiries.value, chunkCount )
}


const drawHexPolygons = ( globe: ThreeGlobe, { features }: FeatureCollection ): void => {
	globe.hexPolygonsData( features )
		.hexPolygonResolution( 3 )
		.hexPolygonMargin( .7 )
		.hexPolygonColor(() => '#3d3d3d' )
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