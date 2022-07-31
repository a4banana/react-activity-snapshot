import { ref } from 'vue'
import type { Ref } from 'vue'
import { MeshBasicMaterial, Mesh, Scene, Vector3 } from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import type { Font } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { getPixelsPerDegree, polar2Cartesian } from './PolarAndCartesian'


export default function DrawText( scene: Scene ) {
    const TEXT_ALT: number = .02
	const TEXT_SIZE: number = .75
    const font: Ref<Font | null> = ref( null )
    const textSize = getPixelsPerDegree( TEXT_SIZE )
    const pointSize = getPixelsPerDegree( 1.5 ) // country point size
    const fontLoader = new FontLoader()
    
    // set font
	fontLoader.load( './helvetiker_regular.typeface.json', response => font.value = response )
    

    function drawTextByCountryName( country: CountryData ): Mesh | undefined {
        if ( font.value ) {
            const text = new TextGeometry( country.name, {
                font: font.value!,
                size: getPixelsPerDegree( textSize ),
                height: 0,
                curveSegments: 3
            })
            text.center()
            const material = new MeshBasicMaterial({ color: 0x6EA1ED })
            const textMesh = new Mesh( text, material )
            const padding = pointSize + textSize / 2
            Object.assign( textMesh.position, polar2Cartesian( country.position.lat, country.position.lng, TEXT_ALT ))
            textMesh.position.y = textMesh.position.y + padding + textSize / 2
            textMesh.lookAt( scene.localToWorld( new Vector3(0, 0, 0) ))
            textMesh.rotateY( Math.PI )
            
            return textMesh
        }
    }

    return {
        drawTextByCountryName
    }
}