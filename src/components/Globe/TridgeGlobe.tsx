import { useContext, useEffect } from "react"
import { QueuesContext, QueuesDispatchContext, QueuesActionType } from "../../contexts/componentReadyContext"
import { CycleContext, CycleDispatchContext, CycleActionTypes } from "../../contexts/cycleContext"
import useRAF from '../../hooks/useRAF'

export default function TridgeGlobe() {
    const queues = useContext( QueuesContext )
    const dispatch = useContext( QueuesDispatchContext )

    const { frame } = useRAF()

    useEffect(() => { frame( 0 ) }, [])

    return (
        <div id="tridge-globe">
        </div>
    )
}