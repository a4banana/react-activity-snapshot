import ReactDOM from 'react-dom'
import ActivitySnapshot from './ActivitySnapshot'

import { CycleProvider } from './contexts/cycleContext'
import { QueuesProvider } from './contexts/queuesContext'
import { InquiryProvider } from './contexts/inquiryContext'
import { SelectedProvider } from './contexts/selectedContext'
import { ProgressProvider } from './contexts/progressContext'

ReactDOM.render(
	<CycleProvider><QueuesProvider><InquiryProvider><ProgressProvider><SelectedProvider>
		<ActivitySnapshot />
	</SelectedProvider></ProgressProvider></InquiryProvider></QueuesProvider></CycleProvider>,
	document.getElementById( 'root' )
)