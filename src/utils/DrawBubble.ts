import { Vector3, Scene, PerspectiveCamera } from 'three'
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer'
import { polar2Cartesian } from './PolarAndCartesian'

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
	link.href = ''
	header.appendChild( link )
	
	const linkLabel: HTMLSpanElement = document.createElement( 'span' )
	linkLabel.textContent = 'Browse Suppliers'
	link.appendChild( linkLabel )
	
	const chevronIcon = document.createElement( 'svg' )
	chevronIcon.setAttribute( 'viewBox', '0 0 24 24' )
	chevronIcon.className = 'icon-chevron'
	link.appendChild( chevronIcon )
	
	const path = document.createElement( 'path' )
	path.setAttribute( 'd', 'M9 18 15 12 9 6' )
	path.setAttribute( 'storke', 'rgba( 110, 161, 237, 1 )' )
	chevronIcon.appendChild( path )

	const p: HTMLParagraphElement = document.createElement( 'p' )
	p.className = 'country-body'
	container.appendChild( p )

	function drawBubble( country: CountryData, cam: PerspectiveCamera ) {
		const div = document.createElement( 'div' )
		div.className = 'country-bubble'
		div.appendChild( container )
		title.textContent = country.name
		p.textContent = `20 inquiries were recieved by suppliers`
		
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