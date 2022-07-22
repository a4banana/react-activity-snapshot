import { useContext, useEffect } from "react"
import { QueuesContext, QueuesDispatchContext, QueuesActionType } from "../../contexts/componentReadyContext"

export default function TridgeGlobe() {
    const queues = useContext( QueuesContext )
    const dispatch = useContext( QueuesDispatchContext )

    useEffect(() => {
        console.log( queues )
    }, [queues])

    const onClickHandler = ( e: any ) => {
        console.log( e ) 
        if ( dispatch ) dispatch({ type: QueuesActionType.INIT_QUEUE })
    }

    const onClickHandler = ( e: any ) => {
        console.log( e ) 
        if ( dispatch ) dispatch({ type: QueuesActionType.INIT_QUEUE })
    }

    return (
        <div id="tridge-globe">
            #tridge-globe
            <button onClick={ onClickHandler }>init</button>
            <button onClick={ onAddHandler }>add</button>
        </div>
    )
}