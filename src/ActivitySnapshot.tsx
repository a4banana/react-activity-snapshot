import './ActivitySnapshot.sass'
import type { FeatureCollection } from 'geojson'
import { CycleProvider } from './contexts/cycleContext'
import { QueuesProvider } from './contexts/queuesContext'
import { InquiryProvider } from './contexts/inquiryContext'
import { SelectedProvider } from './contexts/selectedContext'
import { ProgressProvider } from './contexts/progressContext'

import useFetch from './hooks/useFetch'
import TridgeGlobe from './components/Globe/TridgeGlobe'
import PlaybackControl from './components/PlaybackControl/PlaybackControl'
import ProductCardList from './components/ProductCard/ProductCardList'
import TextInformation from './components/TextInformations/TextInformation'

import { useEffect } from 'react' // dev

export default function App() {
	const GEO_JSON_URI: string = './custom.geojson'
    const { data: geojson } = useFetch<FeatureCollection>( GEO_JSON_URI )

	// dev
	useEffect(() => console.log( 'app init' ), [])

	return (
		<CycleProvider><QueuesProvider><InquiryProvider><ProgressProvider><SelectedProvider>
			<div id="activity-snapshot">
				<h1 className='service-title'>Activity Snapshot</h1>
				<TextInformation />
				<PlaybackControl isLoaded={ true } />
				{ geojson && <TridgeGlobe geojson={ geojson } /> }
				<ProductCardList />
			</div>
		</SelectedProvider></ProgressProvider></InquiryProvider></QueuesProvider></CycleProvider>
	)
}