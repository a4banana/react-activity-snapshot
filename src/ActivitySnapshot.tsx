import './ActivitySnapshot.sass'
import type { FeatureCollection } from 'geojson'

import { CycleActionTypes, CycleContext, CycleDispatchContext } from './contexts/cycleContext'
import { QueuesActionType, QueuesDispatchContext } from './contexts/queuesContext'
import { InquiryActionType, InquiryDispatchContext, getInq, InquiryContext } from './contexts/inquiryContext'

import useFetch from './hooks/useFetch'
import TridgeGlobe from './components/Globe/TridgeGlobe'
import PlaybackControl from './components/PlaybackControl/PlaybackControl'
import ProductCardList from './components/ProductCard/ProductCardList'
import TextInformation from './components/TextInformations/TextInformation'

import { useContext, useEffect } from 'react' // dev

export default function App() {
	const GEO_JSON_URI: string = './custom.geojson'
    const { data: geojson } = useFetch<FeatureCollection>( GEO_JSON_URI )
	const { isLoading, cycle } = useContext( CycleContext )
	const dispatchInquiry = useContext( InquiryDispatchContext )
	const dispatchQueues = useContext( QueuesDispatchContext )
	const getInquiry = getInq();

	// dev
	useEffect(() => console.log( 'app init' ), [])

	useEffect(() => {
		if ( isLoading ) {
			( async() => {
				dispatchQueues({ type: QueuesActionType.ADD_QUEUE, key: 'inquiry' })
				await getInquiry( dispatchInquiry, cycle );
				dispatchQueues({ type: QueuesActionType.DONE_QUEUE, key: 'inquiry' })
			})();
		}
	}, [ isLoading ])


	return (
		<div id="activity-snapshot">
			<h1 className='service-title'>Activity Snapshot</h1>
			<TextInformation />
			<PlaybackControl isLoaded={ true } />
			{ geojson && <TridgeGlobe geojson={ geojson } /> }
			<ProductCardList />
		</div>
	)
}