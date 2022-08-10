import { Scene, WebGLRenderer, PerspectiveCamera,
	AmbientLight, DirectionalLight, Group, Mesh } from 'three'
import ThreeGlobe from 'three-globe'
import { InteractionManager } from 'three.interactive'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer'
import type { FeatureCollection } from 'geojson'

import CountryBubble from './DrawBubble'
import { CountryPoint,
	blurAllPoints, unBlurAllPoints, hoverPoint,
	blurPoint, selectPoint,
	disablePoint, enablePoint } from './DrawCountryPoint'
import InquiryArc from './DrawInquiryArc'
import DrawText from './DrawText'
import { getPixelsPerDegree } from './PolarAndCartesian'
import type { BuyerAndSellerGeoPositionCollection, BuyerAndSellerGeoPosition } from '../hooks/useCountry'
import type { SelectBaseString } from '../contexts/selectedContext'
import gsap from 'gsap'

type Rendereres = Array<WebGLRenderer | CSS3DRenderer>

interface Callback<T = any, U = void> {
	( arg?: T ): U
}

interface DrawSelectedInquiriesArgs {
	countries: CountryDataCollection
	inquiries: BuyerAndSellerGeoPositionCollection
	selectBase: SelectBaseString
	selectedCountry: CountryData | null
	dom: HTMLDivElement
	fn: Callback
}

type DrawSelectedInquiries = ( args: DrawSelectedInquiriesArgs ) => void

export type ThreeControllerType = {
	renderers: Rendereres
	scene: Scene
	cam: PerspectiveCamera
	globe: ThreeGlobe
	interactionManager: InteractionManager
	init: () => void
	drawInquiryArcs: ( inqs: BuyerAndSellerGeoPositionCollection )=> void
	drawCountryPolygon: ( geojson: FeatureCollection ) => void
	drawCountryPoints: ( countries: CountryDataCollection, dom: HTMLDivElement, fn: Callback ) => void
	drawSelectedInquiries: DrawSelectedInquiries
	drawCountryBubble: ( country: CountryData, product?: Product ) => void
	removeSelectedInquiries: () => void
	render: ( isPlaying?: boolean ) => void
}

const LIGHT_COLOR: number = 0xFFFFFF
const SCREEN_WIDTH: number = 1184
const SCREEN_HEIGHT: number = 666
const COUNTRY_POLYGON_COLOR: string = '#3D3D3D'
const BLUR_ALPHA: number = 0.3
const COUNTRY_ALPHA: number = 0.6
const BLUR_RADIUS: number = getPixelsPerDegree( 0.8 )
const DISABLED_RADIUS: number = getPixelsPerDegree( 0.3 )
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
			htmlGroup.children.forEach( c => c.lookAt( cam.position ) )
		}
		updatePoint( pointGroup )
	}

	async function init(): Promise<void> {
		await drawCountryPolygon( geojson )

		scene.add( globe )
		scene.add( new AmbientLight( LIGHT_COLOR, 1 ))
		scene.add( new DirectionalLight( LIGHT_COLOR, .5 ))
		
		// set Camera
		setCamera( cam, SCREEN_WIDTH, SCREEN_HEIGHT, CAM_INITIAL_Z )
		// set OrbitControl
		setOrbitControl( obControl, {
			autoRotate: true, 
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
		
		// render first frame for globe
		render()
	}

	const drawCountryPoints = ( countries: CountryDataCollection, dom: HTMLDivElement, fn: Callback ) => {
		removeChildsFromGroup( pointGroup, interactionManager )
		countries.forEach(( country: CountryData ) => pointGroup.add( drawCountryPoint( country, dom, fn )))
	}

	const drawInquiryArcs = ( inqs: { buyer: GeoPosition, seller: GeoPosition }[]) => {
		removeChildsFromGroup( lineGroup )
		inqs.forEach(({ buyer, seller }) => lineGroup.add( drawInquiryArc( buyer, seller )))
	}
	
	const drawCountryPolygon = async ( geojson: FeatureCollection ): Promise<void> => {
		await drawHexPolygons( globe, geojson, COUNTRY_POLYGON_COLOR )
		// dirty part for three-globe
		return new Promise( resolve => setTimeout( resolve, 1))
	}
	
	const drawSelectedInquiries = ({
		countries, inquiries, selectBase, selectedCountry, dom, fn
	}: DrawSelectedInquiriesArgs): void => {
		switch ( selectBase ) {
			case 'country':
				dc()
				break;
			case 'product':
				dp()
				break;
		}

		function dc() {
			// unused
			removeChildsFromGroup( textGroup )
			removeChildsFromGroup( focusedLineGroup )
			removeChildsFromGroup( focusedPointGroup )
			// focusedPointGroup.visible = false
			focusedLineGroup.visible = true
			lineGroup.visible = false
			textGroup.visible = false

			pointGroup.children.forEach( point => {
				point.userData.selected = ( point.userData.iso_a2 === selectedCountry!.iso_a2 ) ? true : false
			})

			drawSelectedArcs( inquiries, focusedLineGroup )
		}

		function dp() {
			removeChildsFromGroup( textGroup )
			removeChildsFromGroup( focusedLineGroup )
			removeChildsFromGroup( focusedPointGroup )
			pointGroup.children.forEach( point => point.userData.selected = false )
			lineGroup.visible = false
			focusedLineGroup.visible = true
			textGroup.visible = true

			// console.log( countries )
			const hasKey = ( iso_a2: string ): boolean => {
				return countries.some( country => country.iso_a2 === iso_a2 )
			};

			pointGroup.children.forEach( point => {
				point.userData.disabled = !hasKey( point.userData.iso_a2 )
			})

			countries.forEach(( country: CountryData ) => {
			// 	focusedPointGroup.add( drawCountryPoint( country, dom, fn ))
				const textMesh: Mesh | undefined = drawTextByCountryName( country )
				if ( textMesh ) textGroup.add( textMesh )
			})

			moveToCamera( countries[Math.floor( Math.random() * countries.length )] )
			drawSelectedArcs( inquiries, focusedLineGroup )
		}
	}

	const removeSelectedInquiries = (): void => {
		removeChildsFromGroup( textGroup )
		removeChildsFromGroup( focusedLineGroup )
		removeChildsFromGroup( focusedPointGroup )
		removeChildsFromGroup( htmlGroup )
		focusedLineGroup.visible = false
		focusedPointGroup.visible = false
		pointGroup.visible = true
		lineGroup.visible = true

		pointGroup.children.forEach( point => {
			point.userData.selected = false
			point.userData.disabled = false
			point.userData.blur = false
			point.userData.hover = false
		})
	}

	const drawCountryBubble = ( country: CountryData, product?: Product ): void => {
		removeChildsFromGroup( htmlGroup )
		htmlGroup.add( drawBubble( country, product ? product : undefined ) )
	}
	
	return {
		renderers, scene, cam, globe, interactionManager,
		init, drawCountryPolygon, drawCountryPoints, drawInquiryArcs, render, drawSelectedInquiries, drawCountryBubble, removeSelectedInquiries
	}
}

const drawSelectedArcs = ( inquiries: BuyerAndSellerGeoPositionCollection, group: Group ) => {
	inquiries.forEach(({ buyer, seller }) => {
		const line = drawInquiryArc( buyer, seller )
		// @ts-ignore
		gsap.to( line.material.uniforms.dashTranslate, { value: 1, duration: 2, ease: "Power3.out"})
		group.add( line )
	})
}

const removeChildsFromGroup = ( group: Group, im?: InteractionManager ) => {
	group.children.forEach( child => {
		group.remove( child )
		if ( im ) im.remove( child )
	})
	group.children = []
}

const drawHexPolygons = ( globe: ThreeGlobe, { features }: FeatureCollection, color: string ) => {
	globe.hexPolygonsData( features )
		.hexPolygonResolution( 3 )
		.hexPolygonMargin( .7 )
		.hexPolygonColor(() => color )
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
	renderes.forEach( renderer => renderer.setSize( width, height ))
}

const initCSS3DRenderer = ( css3DRenderer: CSS3DRenderer ): void => {
	css3DRenderer.domElement.style.position = 'absolute'
	css3DRenderer.domElement.style.top = '0px'
	css3DRenderer.domElement.style.left = '0px'
	css3DRenderer.domElement.style.pointerEvents = 'none'
}

function updatePath( lineGroup: Group ): void {
	// @ts-ignore
	lineGroup.children.forEach( child => child.material.uniforms.dashTranslate.value += 0.0015 )
}

function updatePoint( pointGroup: Group ): void {
	pointGroup.children.forEach( point => {
		if ( !point.userData.selected ) {
			( point.userData.disabled ) ? disablePoint( point, DISABLED_RADIUS, BLUR_ALPHA ) : enablePoint( point, BLUR_RADIUS, COUNTRY_ALPHA );
			( point.userData.hover ) ? hoverPoint( point, FOCUS_RADIUS ) : blurPoint( point, BLUR_ALPHA, BLUR_RADIUS );
		} else {
			selectPoint( point, FOCUS_RADIUS );	
		}
	})
}

