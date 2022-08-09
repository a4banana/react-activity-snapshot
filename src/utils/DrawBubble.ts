import { Vector3, Scene } from 'three'
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer'
import { polar2Cartesian } from './PolarAndCartesian'
import chevron from '../assets/chevron.svg'

export default function CountryBubble( scene: Scene ) {
	const HOST_URI: string = "https://www.tridge.com/sellers/browse"
	const COUNTRY_URL_PARAM: string = "country_In"

	// init DOM
	const container: HTMLDivElement = document.createElement( 'div' )
	container.className = 'container'

	const header: HTMLHeadElement = document.createElement( 'header' )
	header.className = 'country-header'
	container.appendChild( header )
	
	const title: HTMLHeadingElement = document.createElement( 'h1' )
	title.className = 'country-name'
	header.appendChild( title )

	const link: HTMLAnchorElement = document.createElement( 'a' )
	link.className = 'country-link'
	header.appendChild( link )
	
	const linkLabel: HTMLSpanElement = document.createElement( 'span' )
	linkLabel.textContent = 'Browse Suppliers'
	link.appendChild( linkLabel )
	
	const chevronIcon = document.createElement( 'img' )
	chevronIcon.src = chevron
	link.appendChild( chevronIcon )
	
	const p: HTMLParagraphElement = document.createElement( 'p' )
	p.className = 'country-body'
	container.appendChild( p )

	function drawBubble( country: CountryData ) {
		const div = document.createElement( 'div' )
		div.className = 'country-bubble'
		div.appendChild( container )
		title.textContent = country.name
		p.textContent = `20 inquiries were recieved by suppliers`

		// const productQuery: ComputedRef<string> = computed(() => selectedProduct.value ? `&supplyingProducts_In=${ selectedProduct.value.id }` : '' )
		const href = `${HOST_URI}?${COUNTRY_URL_PARAM}=${ country.iso_a2 }`
		link.href = href
		
		// div.addEventListener( 'click', ()=> console.log( country.name, country.iso_a2 ))
		
		const { lat, lng } = country.position
		const coords = polar2Cartesian( lat, lng, .01 )
		const cssObj = new CSS3DObject( div )
		cssObj.updateMatrixWorld( true )
		Object.assign( cssObj.position, coords )
		cssObj.scale.set( 0.2, 0.2, 0.2 )
		cssObj.lookAt( scene.localToWorld( new Vector3(0, 0, 0)))
		cssObj.rotateY( Math.PI )
		
		return cssObj;
	}

	return {
		drawBubble
	}
}