import './ActivitySnapshot.sass'
import { useEffect } from 'react'
import { CycleProvider } from './contexts/cycleContext'
import { QueuesProvider } from './contexts/componentReadyContext'
import { InquiryProvider } from './contexts/inqContext'

import TridgeGlobe from './components/Globe/TridgeGlobe'
import PlaybackControl from './components/PlaybackControl/PlaybackControl'
import ProductCardList from './components/ProductCard/ProductCardList'
import TextInformation from './components/TextInformations/TextInformation'
// import useCycle from './hooks/useCycle'
// import useComponentsReady from './hooks/useComponentReady'
import useFetch from './hooks/useFetch'
const GEO_JSON_URI: string = './custom.geojson'

export default function App() {
	const { data: geoJSON, isLoading } = useFetch<any>( GEO_JSON_URI )

	// on Mounted
	useEffect(() => {
		if ( geoJSON ) console.log( geoJSON )
	}, [ geoJSON ])
	
	return (
		<CycleProvider>
			<QueuesProvider>
				<InquiryProvider>
					<div id="activity-snapshot">
						<h1 className='service-title'>Activity Snapshot</h1>
						<TextInformation />
						<PlaybackControl isLoaded={ true }></PlaybackControl>
						<TridgeGlobe></TridgeGlobe>
						<ProductCardList />
					</div>
				</InquiryProvider>
			</QueuesProvider>
		</CycleProvider>
	)
}