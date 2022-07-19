import { useState } from "react";
import useComponentsReady from "./useComponentReady";

export default function useCycle() {
    enum CycleProperties {
        Speed = 10000,
        Period = 7,
        ProgressDuration = 2000
    }
    
    const CYCLE_SPEED: CycleProperties = CycleProperties.Speed
    const CYCLE_PERIOD: CycleProperties = CycleProperties.Period
    
    const [ cycle, setCycle ] = useState<number>( 0 )
    const [ isPlaying, setIsPlaying ] = useState<boolean>( false )
    const [ isLoading, setIsLoading ] = useState<boolean>( false )
    const [ progress, setProgress ] = useState<number>( 0 )
    
    let start: number = 0
    let previous: number = 0
    let elapsed: number = 0

    // const { initQueue, addQueue, waitForDoneQueues, endQueue } = useComponentsReady()

    function togglePlay(): void {
        setIsPlaying( !isPlaying )
    }

    function pause(): void {
        setIsPlaying( false )
    }

    function play(): void {
        setIsPlaying( true )
    }

    function runCycle( timestamp: number ): void {
        if ( !start ) start = timestamp
		if ( !isPlaying ) previous = timestamp - start - elapsed

		elapsed = timestamp - start - previous
		setProgress( elapsed / CYCLE_SPEED * 100 );

		( elapsed <= CYCLE_SPEED )
			? window.requestAnimationFrame( runCycle )
			: initCycle()
    }

    async function initCycle() {
        // initQueue()

        // setIsLoading( true )
        
        // addQueue( 'progress-indicator' )
		// addQueue( 'date-count-down' )
		// addQueue( 'inquiry-date-fetch' )

        // start = previous = elapsed = 0
        // setCycle( cycle + 1 )
        
        // await waitForDoneQueues()

        nextCycle()
    }

    function resetAttributes() {
        setProgress( 0 )
        setIsLoading( false )
    }

    function nextCycle() {
        resetAttributes()

        if ( isPlaying ) setIsPlaying( true )
        window.requestAnimationFrame( runCycle )
    }

    return {
        cycle, CYCLE_PERIOD,
        progress, isLoading, isPlaying,
        togglePlay, play, pause,
        runCycle, nextCycle, initCycle
    }
}