import './ActivitySnapshot.sass'
import type { FeatureCollection } from 'geojson'
import { CycleProvider } from './contexts/cycleContext'
import { QueuesProvider } from './contexts/componentReadyContext'
import { InquiryProvider } from './contexts/inquiryContext'
import { SelectedProvider } from './contexts/selectedContext'
import useFetch from './hooks/useFetch'

import TridgeGlobe from './components/Globe/TridgeGlobe'
import PlaybackControl from './components/PlaybackControl/PlaybackControl'
import ProductCardList from './components/ProductCard/ProductCardList'
import TextInformation from './components/TextInformations/TextInformation'
import { ProgressProvider } from './contexts/progressContext'

export default function App() {
	const GEO_JSON_URI: string = './custom.geojson'
    const { data: geojson } = useFetch<FeatureCollection>( GEO_JSON_URI )

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