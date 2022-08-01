import { Mesh, CircleBufferGeometry, MeshBasicMaterial, Vector3, Camera } from 'three'
import { polar2Cartesian, getPixelsPerDegree } from './PolarAndCartesian'
import { InteractionManager } from 'three.interactive'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import gsap from 'gsap'

export default function CountryPoint( interactionManager: InteractionManager, cam: Camera, obControl: OrbitControls ) {
	const COUNTRY_POINT_COLOR: number = 0x6EA1ED
	const COUNTRY_OPACITY: number = .6
	const COUNTRY_POINT_ALT: number = .01
	const geometry: CircleBufferGeometry = new CircleBufferGeometry( 1, 16 )
	
	function drawCountryPoint( country: CountryData, dom: HTMLDivElement | undefined ): Mesh {
		const { lat, lng, alt } = country.position
		const material: MeshBasicMaterial = new MeshBasicMaterial({ color: COUNTRY_POINT_COLOR, opacity: COUNTRY_OPACITY, transparent: true })
		const mesh: Mesh = new Mesh( geometry, material )
		Object.assign( mesh.position, polar2Cartesian( lat, lng, COUNTRY_POINT_ALT ))
		mesh.scale.x = mesh.scale.y = getPixelsPerDegree( 0 )
		mesh.scale.z = getPixelsPerDegree( 0.1 )
		
		mesh.lookAt( new Vector3( 0, 0, 0 ))
		mesh.rotateY( Math.PI )
		mesh.userData = {
			iso_a2: country.iso_a2,
			selected: country.selected,
			disabled: country.disabled,
			hover: false
		}
	
		mesh.addEventListener( 'mouseover', event => onMouseEnter( event, dom ))
		mesh.addEventListener( 'mouseleave', event => onMouseLeave( event, country, dom ))
		mesh.addEventListener( 'click', event => onMouseClick( event, country ))
		interactionManager.add( mesh )
		
		let r = getPixelsPerDegree( 0.8 )
	
		gsap.to( mesh.scale, { x: r, y: r, duration: Math.random() * 1 })
		return mesh
	}

	function onMouseEnter( event: any, dom: HTMLDivElement | undefined ) {
		let r = getPixelsPerDegree( 1.2 )
		dom!.classList.add( 'hoverd' )
		gsap.to( event.target.scale, { x: r, y: r, duration: .15 })
		event.target.userData.hover = true
	}
	
	function onMouseLeave( event: any, country: CountryData, dom: HTMLDivElement | undefined ) {
		let r = getPixelsPerDegree( .8 )
		dom!.classList.remove( 'hoverd' )
		if ( !country.selected ) gsap.to( event.target.scale, { x: r, y: r, duration: .15 })
		event.target.userData.hover = false
	}
	
	function onMouseClick( event: any, country: CountryData ) {
		const point = event.target.position
		const center: Vector3 = new Vector3( 0, 0, 0 )
		const cam_distance: number = cam.position.distanceTo( center )
		const point_distance: number = point.distanceTo( center )
		const { x, y, z }: Vector3 = point.clone().multiplyScalar( cam_distance / point_distance )
		// select country
		// if ( event.target.parent.visible ) toggleCountry( country )
		// cam move
		gsap.to( obControl.object.position, { x, y, z, duration: .66, ease: 'sine.out' })
	}

	function moveToCamera( country: CountryData ) {
		const { lat, lng } = country.position
		const { x: _x, y: _y, z: _z } = polar2Cartesian( lat, lng, COUNTRY_POINT_ALT )
		const point = new Vector3( _x, _y, _z )
		
		const center: Vector3 = new Vector3( 0, 0, 0 )
		const cam_distance: number = cam.position.distanceTo( center )
		const point_distance: number = point.distanceTo( center )
		const { x, y, z }: Vector3 = point.clone().multiplyScalar( cam_distance / point_distance )

		gsap.to( obControl.object.position, { x, y, z, duration: 2.4, ease: 'sine.out' })
	}

	return {
		drawCountryPoint, moveToCamera
	}
}