import { BufferGeometry, ShaderMaterial, Line, NormalBlending } from 'three'
import { calcColorVertexArray, calcVertexRelDistances, calcCurve } from './CalcCurve'

const vertexShader: string = "\n    uniform float dashTranslate; \n\n    attribute vec4 vertexColor;\n    varying vec4 vColor;\n    \n    attribute float vertexRelDistance;\n    varying float vRelDistance;\n\n    void main() {\n      // pass through colors and distances\n      vColor = vertexColor;\n      vRelDistance = vertexRelDistance + dashTranslate;\n      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    }\n"
const fragmentShader: string = "\n    uniform float dashOffset; \n    uniform float dashSize;\n    uniform float gapSize; \n    \n    varying vec4 vColor;\n    varying float vRelDistance;\n    \n    void main() {\n      // ignore pixels in the gap\n      if (vRelDistance < dashOffset) discard;\n      if (mod(vRelDistance - dashOffset, dashSize + gapSize) > dashSize) discard;\n    \n      // set px color: [r, g, b, a], interpolated between vertices \n      gl_FragColor = vColor; \n    }\n"
const uniforms = {
    dashSize: { value: 1 },
	gapSize: { value: 1 },
	dashOffset: { value: 1 },
	dashTranslate: { value: 0 }
}

const ARC_SEGMENT: number = 64
const ARC_COLOR: string = 'rgba( 35, 116, 238, 0.4 )'

export default function InquiryArc() {
	const material: ShaderMaterial = new ShaderMaterial({
		vertexShader, fragmentShader, uniforms,
		transparent: true,
		blending: NormalBlending
	})

	function drawInquiryArc( seller: GeoPosition, buyer: GeoPosition, color?: string ): Line {
		const geometry: BufferGeometry = new BufferGeometry()
		const vertexColorArray = calcColorVertexArray( color ? color : ARC_COLOR, ARC_SEGMENT )
		const vertexRelDistances = calcVertexRelDistances( ARC_SEGMENT )
		const curve = calcCurve( seller, buyer )
		const line: Line = new Line( geometry, material.clone() )
		
		line.userData = {}
		line.geometry.setAttribute( 'vertexColor', vertexColorArray )
		line.geometry.setAttribute( 'vertexRelDistance', vertexRelDistances )
		line.geometry.dispose()
		line.geometry.setFromPoints( curve.getPoints( 64 ))
		
		return line
	}

	return {
		drawInquiryArc
	}
}