import './ActivitySnapshot.sass'
import { CycleProvider } from './contexts/cycleContext'
import { QueuesProvider } from './contexts/componentReadyContext'
import { InquiryProvider } from './contexts/inqContext'

import TridgeGlobe from './components/Globe/TridgeGlobe'
import PlaybackControl from './components/PlaybackControl/PlaybackControl'
import ProductCardList from './components/ProductCard/ProductCardList'
import TextInformation from './components/TextInformations/TextInformation'
import { ProgressProvider } from './contexts/progressContext'

export default function App() {
	return (
		<CycleProvider><QueuesProvider><InquiryProvider><ProgressProvider>
			<div id="activity-snapshot">
				<h1 className='service-title'>Activity Snapshot</h1>
				<TextInformation />
				<PlaybackControl isLoaded={ true } />
				<TridgeGlobe />
				<ProductCardList />
			</div>
		</ProgressProvider></InquiryProvider></QueuesProvider></CycleProvider>
	)
}