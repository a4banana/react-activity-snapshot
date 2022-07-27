import { useContext, useEffect } from "react"
import { QueuesContext, QueuesDispatchContext, QueuesActionType } from "../../contexts/componentReadyContext"
import { CycleContext, CycleDispatchContext, CycleActionTypes } from "../../contexts/cycleContext"

export default function TridgeGlobe() {
    const queues = useContext( QueuesContext )
    const dispatch = useContext( QueuesDispatchContext )


    useEffect(() => {
        console.log( queues )
    }, [queues])

    const cycle = useContext( CycleContext )
    const cycleDispatch = useContext( CycleDispatchContext )

    useEffect(() => {
        console.log( cycle )
    }, [ cycle.isPlaying ])

    const onClickHandler = ( e: any ) => {
        console.log( e ) 
        if ( dispatch ) dispatch({ type: QueuesActionType.INIT_QUEUE })
    }

    const onClickHandler1 = ( e: any ) => ( cycleDispatch ) ? cycleDispatch({ type: CycleActionTypes.PLAY }) : ''
    const onClickHandler2 = ( e: any ) => ( cycleDispatch ) ? cycleDispatch({ type: CycleActionTypes.PAUSE }) : ''
    const onClickHandler3 = ( e: any ) => ( cycleDispatch ) ? cycleDispatch({ type: CycleActionTypes.TOGGLE_PLAY }) : ''

    return (
        <div id="tridge-globe">
            #tridge-globe
            <button onClick={ onClickHandler }>init</button>
            <button onClick={ onClickHandler1 }>play</button>
            <button onClick={ onClickHandler2 }>pause</button>
            <button onClick={ onClickHandler3 }>toggle</button>
            {/* <button onClick={ onAddHandler }>add</button> */}
        </div>
    )
}