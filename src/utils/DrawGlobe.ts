import { Mesh, MeshPhongMaterial, SphereBufferGeometry } from "three";

export default function DrawGlobe() {
    const GLOBE_RADIUS: number = 100
    
    const geometry: SphereBufferGeometry = new SphereBufferGeometry( GLOBE_RADIUS, 75, 75 )
    const material: MeshPhongMaterial = new MeshPhongMaterial({
        color: 0xFF0000,
        transparent: true
    })
    const globe: Mesh = new Mesh( geometry, material )
    
    globe.rotation.y = -Math.PI / 2

    return {
        globe
    }
}