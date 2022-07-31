// Three Globe Radius
const GLOBE_RADIUS = 100

// Pixel Per Degree
const PIXEL_PER_DEGREE: number = 2 * Math.PI * GLOBE_RADIUS / 360;

// Polar to Cartesian
export function polar2Cartesian( lat: number , lng: number, alt?: number ): { x: number, y: number, z: number } {
	let relAlt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0
	let phi = ( 90 - lat ) * Math.PI / 180
	let theta = ( 90 - lng ) * Math.PI / 180
	let r = GLOBE_RADIUS * ( 1 + relAlt )
	return {
		x: r * Math.sin( phi ) * Math.cos( theta ),
		y: r * Math.cos( phi ),
		z: r * Math.sin( phi ) * Math.sin( theta )
	}
}

// Cartesian to Polar
export function cartesian2Polar( x: number, y: number, z: number ): { lat: number, lng: number, alt: number } {
	let r = Math.sqrt( x * x + y * y + z * z )
	let phi = Math.acos( y / r )
	let theta = Math.atan2( z, x )
	return {
	  lat: 90 - phi * 180 / Math.PI,
	  lng: 90 - theta * 180 / Math.PI - ( theta < -Math.PI / 2 ? 360 : 0 ),
	  alt: r / GLOBE_RADIUS - 1
	}
}

export function getPixelsPerDegree( val: number ): number {
	return val * PIXEL_PER_DEGREE
}