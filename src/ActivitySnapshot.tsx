import { useEffect, useState } from 'react'
import './ActivitySnapshot.sass'
import { CycleProvider } from './contexts/cycleContext'
import { QueuesProvider } from './contexts/componentReadyContext'
import { InquiryProvider } from './contexts/inqContext'

import TridgeGlobe from './components/Globe/TridgeGlobe'
import PlaybackControl from './components/PlaybackControl/PlaybackControl'
import ProductCardList from './components/ProductCard/ProductCardList'
// import useCycle from './hooks/useCycle'
// import useComponentsReady from './hooks/useComponentReady'
import useFetch from './hooks/useFetch'

const GEO_JSON_URI: string = './custom.geojson'

export default function App() {
	const { data: geoJSON, isLoading } = useFetch<any>( GEO_JSON_URI )
	// const [ isGeoJSONReady, setIsGeoJSONReady ] = useState<boolean>( false )
	// const [ isCurtainUp, setIsCurtainUp ] = useState<boolean>( false )

	// on Mounted
	useEffect(() => {
		console.log( geoJSON )
	}, [ geoJSON ])

	async function loadingComplete() {
		// setIsCurtainUp( true )
		// await initCycle()
	}
	
	return (
		<CycleProvider>
			<QueuesProvider>
				<InquiryProvider>
					<div id="activity-snapshot">
						<h1 className='service-title'>Activity Snapshot</h1>
						<PlaybackControl isLoaded={ true }></PlaybackControl>
						<TridgeGlobe></TridgeGlobe>
						<ProductCardList />
					</div>
				</InquiryProvider>
			</QueuesProvider>
		</CycleProvider>
	)
}