import { Vector3, Scene } from 'three'
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer'
import { polar2Cartesian } from './PolarAndCartesian'
import chevron from '../assets/chevron.svg'

export default function CountryBubble( scene: Scene ) {
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

	function drawBubble( count: number, country: CountryData, product?: Product ) {
		const div = document.createElement( 'div' )
		div.className = 'country-bubble'
		div.appendChild( container )
		title.textContent = country.name
		p.textContent = bodyText( count )
		const href = hrefWithUrlParam( country.iso_a2, product?.id )
		link.href = href
		
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

const hrefWithUrlParam = ( iso_a2: string, id?: number ): string => {
	const HOST_URI: string = "https://www.tridge.com/sellers/browse"
	const COUNTRY_URL_PARAM: string = "country_In"
	const PRODUCT_URL_PARAM: string = "supplyingProducts_In"
	const countryParam = `${ COUNTRY_URL_PARAM }=${iso_a2}`
	const productParam = id ? `${ PRODUCT_URL_PARAM }=${id}` : ''
	return `${ HOST_URI }?${countryParam}${productParam}`
}

const bodyText = ( count: number ): string => {
	return ( count > 1 ) ? `${count} inquiries were recieved by suppliers` : 'A inquiry was recieved by a supplier'
}