import { useEffect, useState } from 'react'
import './ActivitySnapshot.sass'

// import useCycle from './hooks/useCycle'
// import useComponentsReady from './hooks/useComponentReady'
import useTest from './hooks/useTest'
import useFetch from './hooks/useFetch'

const GEO_JSON_URI: string = './custom.geojson'

function App() {
	const { data: geoJSON, isLoading } = useFetch<any>( GEO_JSON_URI )
	const [ value, setString ] = useTest()
	// const [ initCycle ] = useCycle()

	// const [ isGeoJSONReady, setIsGeoJSONReady ] = useState<boolean>( false )
	// const [ isCurtainUp, setIsCurtainUp ] = useState<boolean>( false )

	// on Mounted
	useEffect(() => {
		console.log( geoJSON )
	}, [ geoJSON ])	

	useEffect(() => {
		console.log( value )
	}, [ value ])

	async function loadingComplete() {
		// setIsCurtainUp( true )
		// await initCycle()
	}
	
	function test(): any {
		console.log( 'clicked' )
		const val: string = (Math.random() + 1).toString(36).substring(7);
		setString( val )
	}

	return (
		<div id="activity-snapshot">
			<h1 className='service-title'>Activity Snapshot</h1>
			<button onClick={() => test() }>{ value }</button>
		</div>
	)
}

export default App
