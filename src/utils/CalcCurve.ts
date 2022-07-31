import { Vector3, CubicBezierCurve3, Float32BufferAttribute } from 'three'
import Adder from './Adder'
import tinycolor from 'tinycolor2'
import { polar2Cartesian } from './PolarAndCartesian';
import type { ColorFormats } from 'tinycolor2'

type TempLengthStream = {
	[ key: string ]: any
}

const lengthStream: TempLengthStream = {
	sphere: noop,
	point: noop,
	lineStart: lengthLineStart,
	lineEnd: noop,
	polygonStart: noop,
	polygonEnd: noop
}

// const ALT_AUTO_SCALE = -1e-3
const haversin = ( x: number ) => ( x = Math.sin( x / 2 )) * x
const asin = ( x: number ) => x > 1 ? ( Math.PI / 2 ) : x < -1 ? -( Math.PI / 2 ) : Math.asin( x )

function geoInterpolate( a: number[], b: number[] ) {
    const x0 = a[0] * ( Math.PI / 180 )
    const y0 = a[1] * ( Math.PI / 180 )
    const x1 = b[0] * ( Math.PI / 180 )
    const y1 = b[1] * ( Math.PI / 180 )
    const cy0 = Math.cos( y0 )
    const sy0 = Math.sin( y0 )
    const cy1 = Math.cos( y1 )
    const sy1 = Math.sin( y1 )
    const kx0 = cy0 * Math.cos( x0 )
    const ky0 = cy0 * Math.sin( x0 )
    const kx1 = cy1 * Math.cos( x1 )
    const ky1 = cy1 * Math.sin( x1 )
    const d = 2 * asin(Math.sqrt( haversin( y1 - y0 ) + cy0 * cy1 * haversin( x1 - x0 )))
    const k = Math.sin( d )

	const interpolate = ( t: number ) => {
		let B = Math.sin( t *= d ) / k
		let	A = Math.sin( d - t ) / k
		let	x = A * kx0 + B * kx1
		let	y = A * ky0 + B * ky1
		let	z = A * sy0 + B * sy1

		return [
			Math.atan2( y, x ) * ( 180 / Math.PI ),
			Math.atan2( z, Math.sqrt( x * x + y * y )) * ( 180 / Math.PI )
		]
	}

	return interpolate
}

function noop() {}

let _lambda: number = 0
let _sinPhi: number = 0
let _cosPhi: number = 0
let lengthSum: Adder

function lengthLineStart() {
	lengthStream.point = lengthPointFirst
	lengthStream.lineEnd = lengthLineEnd
}

function lengthPointFirst( lambda: number, phi: number) {
    lambda *= Math.PI / 180
	phi *= Math.PI / 180
    _lambda = lambda
	_sinPhi = Math.sin( phi )
	_cosPhi = Math.cos( phi )

    lengthStream.point = lengthPoint;
}

function lengthPoint( lambda: number, phi: number ) {
    lambda *= Math.PI / 180
	phi *= Math.PI / 180
	
	let sinPhi = Math.sin( phi )
	let cosPhi = Math.cos( phi )
	let delta = Math.abs( lambda - _lambda )
	let cosDelta = Math.cos( delta )
	let sinDelta = Math.sin( delta )
	let x = cosPhi * sinDelta
	let y = _cosPhi * sinPhi - _sinPhi * cosPhi * cosDelta
	let z = _sinPhi * sinPhi + _cosPhi * cosPhi * cosDelta

	lengthSum.add( Math.atan2( Math.sqrt( x * x + y * y ), z ))
    
	_lambda = lambda
	_sinPhi = sinPhi
	_cosPhi = cosPhi
}

function lengthLineEnd() {
    lengthStream.point = lengthStream.lineEnd = noop;
}

type LineObject = {
	type: 'LineString'
	coordinates: Array<number[]>
}

function geoDistance( a: number[], b: number[] ) {
	const _lineObject: LineObject = {
		type: 'LineString',
		coordinates: [ a, b ]
	}
	return length( _lineObject );
}

function length( object: LineObject ) {
	lengthSum = new Adder();
	streamLine( object.coordinates, lengthStream, 0 )
	return +lengthSum;
}

function streamLine( coordinates: Array<number[]>, stream: TempLengthStream, closed: number ) {
    let i = -1
	let n = coordinates.length - closed
	let coordinate

    stream.lineStart()

    while ( ++i < n ) coordinate = coordinates[ i ], stream.point( coordinate[0], coordinate[1], coordinate[2] )
    
	stream.lineEnd()
}

export function calcCurve( from: GeoPosition, to: GeoPosition ) {
	let fromPoint = [ from!.lng, from!.lat ]
	let toPoint = [ to!.lng, to!.lat ]

	const alt: number = geoDistance( fromPoint, toPoint ) / 2 * 0.5
	const interpolate = geoInterpolate( fromPoint, toPoint )

	const [ m1, m2 ] = Array.from( [ 0.25, 0.75 ], x => new Array().concat( interpolate( x ), [ alt * 1.5 ] ))
	const getVec = ( ref: any ) => {
		const { x, y, z } = polar2Cartesian( ref[1], ref[0], ref[2] )
		return new Vector3( x, y, z )
	}

	const [ v0, v1, v2, v3 ] = [ fromPoint, m1, m2, toPoint ].map( getVec )
	const curve = new CubicBezierCurve3( v0, v1, v2, v3 )

	return curve
}

export function calcColorVertexArray( colors: string, numSegments: number = 64 ) {
	let numVerticesPerSegment: number = 1
	let numVerticesGroup = numSegments + 1

	let vertexColor = color2ShaderArr( colors )
	let vertexColorArray = new Float32BufferAttribute(numVerticesGroup * 4 * numVerticesPerSegment, 4);

	for ( let v = 0, l = numVerticesGroup; v < l; v++ ) {
		for ( let s = 0; s < numVerticesPerSegment; s++ ) {
			vertexColorArray.set( vertexColor, ( v * numVerticesPerSegment + s ) * 4 )
		}
	}

	return vertexColorArray
}

function color2ShaderArr( str: string ) {
    let rgba: ColorFormats.RGBA = tinycolor( str ).toRgb()
	// @ts-ignore
	return Object.keys( rgba ).map(( k: string ) => ( k !== 'a' ) ? rgba[ k ] / 255 : rgba[ k ] )
}

export function calcVertexRelDistances( numSegments: number = 64 ) {
	let numVerticesPerSegment: number = 1
	let invert: boolean = false
	let numVerticesGroup: number = numSegments + 1
	let arrLen: number = numVerticesGroup * numVerticesPerSegment
	let vertexDistanceArray: Float32BufferAttribute = new Float32BufferAttribute( arrLen, 1 )

	for ( let v = 0, l = numVerticesGroup; v < l; v++ ) {
		let relDistance: number = v / ( l - 1 );

		for ( let s = 0; s < numVerticesPerSegment; s++ ) {
			let idx: number = v * numVerticesPerSegment + s
			let pos: number = invert ? arrLen - 1 - idx : idx
			vertexDistanceArray.setX( pos, relDistance )
		}
	}

	return vertexDistanceArray
}