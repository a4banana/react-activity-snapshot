import { Scene, WebGLRenderer, PerspectiveCamera,
	AmbientLight, DirectionalLight, Group, Mesh } from 'three'
import ThreeGlobe from 'three-globe'
import { InteractionManager } from 'three.interactive'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer'
import type { FeatureCollection } from 'geojson'

import CountryBubble from './DrawBubble'
import CountryPoint from './DrawCountryPoint'
import InquiryArc from './DrawInquiryArc'
import DrawText from './DrawText'
import { getPixelsPerDegree } from './PolarAndCartesian'
import gsap from 'gsap'

type Rendereres = Array<WebGLRenderer | CSS3DRenderer>

interface Callback<T = any, U = void> {
	( arg?: T ): U
}

interface BuyerAndSellerGeoPosition {
    buyer: GeoPosition
    seller: GeoPosition
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
	drawSelectedInquiries: ( countries: CountryDataCollection, inqs: any, dom: HTMLDivElement, fn: Callback ) => void
	drawCountryBubble: ( country: CountryData ) => void
	render: ( isPlaying?: boolean ) => void
}

const LIGHT_COLOR: number = 0xFFFFFF
const SCREEN_WIDTH: number = 1184
const SCREEN_HEIGHT: number = 666
const COUNTRY_POLYGON_COLOR: string = '#3D3D3D'
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
const { drawCountryPoint, moveToCamera } = countryPoint
const inquiryArc = InquiryArc()
const { drawInquiryArc } = inquiryArc
const { drawTextByCountryName } = DrawText( scene )
const { drawBubble } = CountryBubble( scene )

const pointGroup: Group = new Group()
const lineGroup: Group = new Group()

const textGroup: Group = new Group()
const focusedLineGroup: Group = new Group()
const focusedPointGroup: Group = new Group()
const htmlGroup: Group = new Group()

export default function ThreeController( geojson: FeatureCollection ): ThreeControllerType {
	function render( isPlaying?: boolean ): void {
		obControl.update()
		interactionManager.update()
		renderers.forEach( r => r.render( scene, cam ) )
		webGLRenderer.render( scene, cam )
		css3DRenderer.render( scene, cam )
		
		if ( isPlaying ) {
			updatePath( lineGroup )
			updatePoint( pointGroup )
			htmlGroup.children.forEach( c => c.lookAt( cam.position ) )
		}
	}

	function init(): void {
		drawHexPolygons( globe, geojson, COUNTRY_POLYGON_COLOR )

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

		scene.add( focusedLineGroup )
		scene.add( focusedPointGroup )
		scene.add( textGroup )
		scene.add( pointGroup )
		scene.add( lineGroup )
		scene.add( htmlGroup )

		setRenderersSize( renderers, SCREEN_WIDTH, SCREEN_HEIGHT )
		initCSS3DRenderer( css3DRenderer )
		// render first frame
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
	
	const drawSelectedInquiries = ( countries: CountryDataCollection, inqs: BuyerAndSellerGeoPosition[], dom: HTMLDivElement, fn: Callback ): void => {
		initBeforeDrawSelected()

		if ( countries.length ) {
			// draw Country focused
			countries.forEach(( country: CountryData ) => {
				focusedPointGroup.add( drawCountryPoint( country, dom, fn ))
				const textMesh: Mesh | undefined = drawTextByCountryName( country )
				if ( textMesh ) textGroup.add( textMesh )
			})

			// move To Random country point
			moveToCamera( countries[Math.floor( Math.random() * countries.length )] )
		}

		if ( inqs.length ) {
			// draw Path
			inqs.forEach(({ buyer, seller }) => {
				const line = drawInquiryArc( buyer, seller )
				// @ts-ignore
				gsap.to( line.material.uniforms.dashTranslate, { value: 1, duration: 2, ease: "Power3.out"})
				focusedLineGroup.add( line )
			})
		}
	}

	const drawCountryBubble = ( country: CountryData ): void => {
		htmlGroup.add( drawBubble( country, cam ) )
	}
	
	return {
		renderers, scene, cam, globe, interactionManager,
		init, drawCountryPolygon, drawCountryPoints, drawInquiryArcs, render, drawSelectedInquiries, drawCountryBubble
	}
}

const initBeforeDrawSelected = (): void => {
	textGroup.children = []
	focusedLineGroup.children = []
	focusedPointGroup.children = []
	pointGroup.children.forEach( point => point.userData.selected = false )
	pointGroup.visible = false
	lineGroup.visible = false
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

const setOrbitControl = ( ob: OrbitControls, opts: {[ key: string ]: unknown } ): void => {
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

function updatePoint( pointGroup: Group ): void {
	if ( pointGroup.children.some( point => point.userData.selected === true ) ) {
		pointGroup.children.forEach( point => {
			if ( !point.userData.selected ) {
				if ( point.userData.hover ) {
					// @ts-ignore - material doesn't captured via Group
					point.material!.opacity = .8
					point.scale.x = point.scale.y = FOCUS_RADIUS
				} else {
					// @ts-ignore - material doesn't captured via Group
					if ( point.material.opacity > BLUR_ALPHA ) point.material!.opacity -= 0.03
					if ( point.scale.x > BLUR_RADIUS ) point.scale.x = point.scale.y -= 0.03
				}
			} else {
				// @ts-ignore - material doesn't captured via Group
				if ( point.material!.opacity < 1 ) point.material!.opacity += 0.03
				if ( point.scale.x < FOCUS_RADIUS ) point.scale.x = point.scale.y += 0.03
			}
		})
	}
}