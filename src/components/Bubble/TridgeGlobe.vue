<script setup lang='ts'>
import { ref, onBeforeMount, onMounted, watch } from 'vue'
import type { Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { CycleProperties } from '@/composables/useCycle'

// THREE
import { Scene, WebGLRenderer, PerspectiveCamera,
	AmbientLight, DirectionalLight, Group, Mesh, Object3D, Vector3
	} from 'three'
import ThreeGlobe from 'three-globe'
import { InteractionManager } from 'three.interactive'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer'
// GreenSock
import { gsap } from 'gsap'

import { useInquiryDataStore } from '@/stores/useInquiryDataStore'
// import CountryBubble from '@/components/Bubble/CountryBubble.vue'
import useComponentsReady from '@/composables/useComponentsReady'
import useCycle from '@/composables/useCycle'
import useCountryData from '@/composables/useCountryData'
import { chunk } from 'lodash-es'

import { getPixelsPerDegree, polar2Cartesian } from '@/utils/PolarAndCartesian'
import CountryPoint from '@/utils/DrawCountryPoint'
import InquiryArc from '@/utils/DrawInquiryArc'
import DrawText from '@/utils/DrawText'
import CountryBubble from '@/utils/DrawBubble'

interface Props {
	geoJSON: any
}

const { countries,
	hasCountry, createCountry, getPosition, resetCountries, getCountryDatasByISOA2Array } = useCountryData()

const { isLoading, isPlaying, play, pause } = useCycle()

const props = defineProps<Props>()

const SCREEN_WIDTH: number = 1184
const SCREEN_HEIGHT: number = 666
const BLUR_ALPHA: number = 0.3
const BLUR_RADIUS: number = getPixelsPerDegree( 0.8 )
const FOCUS_RADIUS: number = getPixelsPerDegree( 1.2 )

const dom: Ref<HTMLDivElement | undefined> = ref()
const webGLRenderer = new WebGLRenderer({ antialias: true, alpha: true })
const css3DRenderer = new CSS3DRenderer()
const renderer: Array<WebGLRenderer | CSS3DRenderer> = [ webGLRenderer, css3DRenderer ]
const scene: Scene = new Scene()
const cam: PerspectiveCamera = new PerspectiveCamera()
const globe: ThreeGlobe = new ThreeGlobe()
const obControl: OrbitControls = new OrbitControls( cam, webGLRenderer.domElement )
const interactionManager: InteractionManager = new InteractionManager( webGLRenderer, cam, webGLRenderer.domElement, undefined )

const inquiryStore = useInquiryDataStore()
const { deselectCountry, deselectProduct } = inquiryStore
const { inquiries, inquiriesBySelected, countryCodesBySelected, selectedCountry, selectedProduct, selectBase } = storeToRefs( inquiryStore )
const { isQueueEnd } = useComponentsReady()

// default point and line group
const pointGroup: Group = new Group()
const lineGroup: Group = new Group()
const textGroup: Group = new Group()
const htmlGroup: Group = new Group()

// focused point and line group
const focusedLineGroup: Group = new Group()
const focusedPointGroup: Group = new Group()

const countryPoint = CountryPoint( interactionManager, cam, obControl )
const { drawCountryPoint, moveToCamera } = countryPoint
const inquiryArc = InquiryArc()
const { drawInquiryArc } = inquiryArc
const { drawBubble } = CountryBubble( scene )

const drawText = DrawText( scene )
const { drawTextByCountryName } = drawText

onBeforeMount( async () => {
	// draw country hex polygons
	drawHexPolygons( props.geoJSON )
	// let isPan: boolean = false
	// let point: { x: number; y: number; } = { x: 0, y: 0 }

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

	// pan events for OrbitControl
	// const DISTANCE_LIMIT = 35;
	// function pointerMove( event: PointerEvent ) {
	// 	if ( isPan && selectedCountry.value ) {
	// 		const { x, y } = event
	// 		const distance: number = Math.hypot( x - point.x, y - point.y )
			
	// 		if ( distance > DISTANCE_LIMIT ) {
	// 			deselectCountry()
	// 		}
	// 	}
	// }

	// function pointerDown( event: PointerEvent ) {
	// 	const { x, y } = event
	// 	isPan = true
	// 	point = { x, y }
	// }

	// function pointerUp( event: PointerEvent ) {
	// 	isPan = false
	// 	point = { x: 0, y: 0 }
	// }

	// webGLRenderer.domElement.addEventListener( 'pointerdown', pointerDown )
	// webGLRenderer.domElement.addEventListener( 'pointerup', pointerUp )
	// webGLRenderer.domElement.addEventListener( 'pointermove', pointerMove )
})

onMounted( async () => {
	if ( dom.value ) {
		dom.value.appendChild( webGLRenderer.domElement )
		dom.value.appendChild( css3DRenderer.domElement )
	}
	// run
	window.requestAnimationFrame( globeFrame )
})

// is Queue End = start globe animation
watch( isQueueEnd, queueEnd => {
	if ( queueEnd === true ) generateArcsAndPoints( globe )
})

// is Loading End = session cycle end
watch( isLoading, loading => {
	if ( loading === true ) pointGroup.children.forEach( child => gsap.to( child.scale, { x: 0, y: 0, duration: .5 }) )
})

// play and stop sync globe auto rotation
watch( isPlaying, playing => obControl.autoRotate = playing )

// watch inquiries by selected country | product
watch( inquiriesBySelected, ( inquiries, ov ) => {
	let isSelected = inquiries.length
	if ( isSelected && selectBase.value === 'country' ) {
		drawSelectedBasedCountry()
	}

	if ( isSelected && selectBase.value === 'product' ) {
		if ( inquiries.length !== ov.length ) {
			drawSelectedBasedProduct()
		}
	}
})

watch( selectedCountry, ( country, ov ) => {
	if ( country ) {
		drawSelectedCountryBubble( country )
	}
	if ( selectBase.value === 'country' ) {
		if ( country === null && ov !== null ) deselectCountryPoint()
		if ( country !== null && selectedProduct.value !== null && country !== ov ) deselectProduct()
	}
})

watch( selectedProduct, ( product, ov ) => {
	if ( product === null && ov !== null ) deselectProductPath()
	// if ( product !== null && selectedProduct.value !== null && country !== ov ) deselectProduct()
})

function drawSelectedCountryBubble( country: CountryData ) {
	htmlGroup.children.forEach( bubble => htmlGroup.remove( bubble ))
	htmlGroup.children = []

	htmlGroup.add( drawBubble( country, cam ))
}

function deselectCountryPoint() {
	textGroup.children = []
	focusedLineGroup.children = []
	focusedPointGroup.children = []
	pointGroup.children.forEach( point => {
		point.userData.selected = false
		// @ts-ignore - material doesn't captured via Group
		gsap.to( point.material, { opacity: .6, duration: .33 })
		gsap.to( point.scale, { x: BLUR_RADIUS, y: BLUR_RADIUS, duration: .33 })
	})
	removeSelected()
}

function deselectProductPath() {
	textGroup.children = []
	focusedLineGroup.children = []
	focusedPointGroup.children = []
	removeSelected()
	deselectCountry()
	play()
}

function drawSelectedBasedCountry() {
	// init selected
	textGroup.children = []
	focusedLineGroup.children = []
	focusedPointGroup.children = []
	pointGroup.children.forEach( point => point.userData.selected = false )
	hideAllPath()

	// highlight current country
	pointGroup.children.forEach( point => {
		if ( point.userData.iso_a2 === selectedCountry.value?.iso_a2 ) {
			point.userData.selected = true
		}
	})
	

	// draw current path
	inquiriesBySelected.value.forEach(( inq: BuyerInquirySellerForWorldMapType ) => {
		let seller = getPosition( inq.sellerCountry )
		let buyer = getPosition( inq.buyerCountry )

		if (( seller && buyer ) && ( seller !== buyer )) {
			const line = drawInquiryArc( buyer, seller, 'rgba( 35, 116, 238, 0.8 )' )
			// @ts-ignore - Property 'uniforms' does not exist on type 'Material | Material[]'. Property 'uniforms' does not exist on type 'Material'.
			gsap.to( line.material.uniforms.dashTranslate, { value: 1, duration: 2, ease: "Power3.out"})
			focusedLineGroup.add( line )
		}
	})
}


// draw for selected country | product
function drawSelectedBasedProduct(): void {
	// init
	textGroup.children = []
	focusedLineGroup.children = []
	focusedPointGroup.children = []
	pointGroup.children.forEach( point => point.userData.selected = false )
	hideAllPoint()
	hideAllPath()
	pause()
	
	// draw Country focused
	const selectedCountryDatas = getCountryDatasByISOA2Array( countryCodesBySelected.value )
	selectedCountryDatas.forEach(( country: CountryData ) => {
		focusedPointGroup.add( drawCountryPoint( country, dom.value ))
		const textMesh: Mesh | undefined = drawTextByCountryName( country )
		if ( textMesh ) textGroup.add( textMesh )
	})

	// move To Random country point
	moveToCamera( selectedCountryDatas[Math.floor( Math.random() * selectedCountryDatas.length )] )

	// draw Path
	inquiriesBySelected.value.forEach(( inq: BuyerInquirySellerForWorldMapType ) => {
		let seller = getPosition( inq.sellerCountry )
		let buyer = getPosition( inq.buyerCountry )

		if (( seller && buyer ) && ( seller !== buyer )) {
			const line = drawInquiryArc( buyer, seller, 'rgba( 35, 116, 238, 0.8 )' )
			// @ts-ignore - Property 'uniforms' does not exist on type 'Material | Material[]'. Property 'uniforms' does not exist on type 'Material'.
			gsap.to( line.material.uniforms.dashTranslate, { value: 1, duration: 2, ease: "Power3.out"})
			focusedLineGroup.add( line )
		}
	})
}

// remove for nothing selected
function removeSelected(): void {
	showAllPath()
	showAllPoint()
}

function globeFrame( timestamp: number ): void {
	obControl.update()
	interactionManager.update()
	renderer.forEach( r => r.render( scene, cam ) )
	// webGLRenderer.render( scene, cam )
	// css3DRenderer.render( scene, cam )
	updatePath()
	updatePoint()
	// htmlGroup.children.forEach( c => c.lookAt( cam.position ) )
	window.requestAnimationFrame( globeFrame )
}

function updatePoint() {
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

function updatePath() {
	if ( isPlaying.value ) {
		lineGroup.children.forEach( l => { l.children.forEach(
			// @ts-ignore
			child => child.material.uniforms.dashTranslate.value += 0.0015
		)})
	}
}

function drawHexPolygons( countries: any ) {
	globe.hexPolygonsData( countries )
		.hexPolygonResolution( 3 )
		.hexPolygonMargin( .7 )
		.hexPolygonColor(() => '#3d3d3d' )
}

const _getCountryByCode = ( iso_a2: string ) => {
	const country = props.geoJSON.find(( g: any ) => g.properties.iso_a2 === iso_a2 ) || null
	return country
}

const _hasFeatureAndThreeObj = ( feature: any, iso_a2: string ): boolean => {
	if ( feature && Object.getOwnPropertyNames( feature ).includes( '__threeObj' ) ) {
		return true
	} else {
		console.error( iso_a2 + ' data not found in geojson' )
		return false
	}
}

const _isValidCoord = ( pos: { x: number, y: number, z: number }, iso_a2: string, name: string ): boolean => {
	if ( pos.x !== 0 && pos.y !== 0 && pos.z !== 0 ) {
		return true
	} else {
		console.error( iso_a2 + ' is wrong position -- ' + name )
		return false
	}
}

const getCountryGeoCoods = ( iso_a2: string, globe: ThreeGlobe ) => {
	const feature = _getCountryByCode( iso_a2 )

	if ( _hasFeatureAndThreeObj( feature, iso_a2 ) ) {
		const { name } = feature.properties
		const { x, y, z } = feature.__threeObj.geometry.boundingSphere.center

		if ( _isValidCoord( { x, y, z }, iso_a2, name )) {
			const { lat, lng, altitude: alt } = globe.toGeoCoords({ x, y, z })
			const position = { lat, lng, alt }
			return {
				position, name
			}
		}
	}
}



function generateArcsAndPoints( globe: any ) {
	// remove points from interaction manager
	pointGroup.children.forEach( child => interactionManager.remove( child ))
	// reset Three Point Group
	pointGroup.children = []
	// reset current point Data
	resetCountries()
	// reest Three Line Group
	lineGroup.children = []
	htmlGroup.children.forEach( cssobj => htmlGroup.remove( cssobj ) )
	htmlGroup.children = []

	const sellers = [ ...new Set( inquiries.value.map( inq => inq.sellerCountry ))]
	const buyers = [ ...new Set( inquiries.value.map( inq => inq.buyerCountry ))]

	sellers.forEach( country => createOrUpdateCountry( country ))
	buyers.forEach( country => createOrUpdateCountry( country ))

	countries.value.forEach(( country: CountryData ) => pointGroup.add( drawCountryPoint( country, dom.value ) ))
	htmlGroup.add( drawBubble( countries.value[0], cam ))

	const seg = 3
	const gap = .5
	const segTime = CycleProperties.Speed / seg
	const segDelay = segTime * gap
	const segDuration = ( i: number ) => segDelay * i * 2;
	
	const chunkCount: number = Math.ceil( inquiries.value.length / seg )
	const chunks = chunk( inquiries.value, chunkCount )

	chunks.forEach(( ch, i ) => {
		let _group = new Group()
		lineGroup.add( _group )
		ch.forEach( country => {
			setTimeout( function() {
				let seller = getPosition( country.sellerCountry )
				let buyer = getPosition( country.buyerCountry )

				if (( seller && buyer ) && ( seller !== buyer )) {
					const line = drawInquiryArc( buyer, seller )
					_group.add( line )
				}
			}, segDuration( i ))
		})
	})
}

function hideAllPath() {
	lineGroup.visible = false
}

function showAllPath() {
	focusedLineGroup.children = []
	lineGroup.visible = true
}

function hideAllPoint() {
	pointGroup.visible = false
}

function showAllPoint() {
	focusedPointGroup.children = []
	pointGroup.visible = true
}

function createOrUpdateCountry( iso_a2: string ) {
	// create countries
	if ( !hasCountry( iso_a2 )) {
		const geoInfo = getCountryGeoCoods( iso_a2, globe )
		
		if ( geoInfo ) {
			const { name, position } = geoInfo
			createCountry( iso_a2, name, position )
		}
	}
}
</script>

<template lang='pug'>
#tridge-globe( ref="dom" )
	//- CountryBubble( v-if="selectedCountry" )
</template>

<style lang='sass' scoped>
#tridge-globe
	position: absolute
	z-index: 1
	width: 100%
	height: 100%
	top: 0
	left: 0
	background-color: rgba( 0, 0, 0, .8 )

	&.hoverd
		cursor: pointer
</style>