import { CycleActionTypes } from './../contexts/cycleContext';
import { useContext, useState } from "react"
import { CycleContext, CycleDispatchContext } from "../contexts/cycleContext"

interface IUseRAF {
    frame: ( timestamp: number ) => void
}

export default function useRAF(): IUseRAF {
    const CYCLE_SPEED = 10000
    let start: number | null = null
    let elapsed = 0
    let previous = 0
    
    const dispatch = useContext( CycleDispatchContext )
    const { isPlaying } = useContext( CycleContext )
    
    function frame( timestamp: number ) {
        if ( !start ) start = timestamp
        if ( !isPlaying ) previous = timestamp - start - elapsed
        
        elapsed = timestamp - start - previous
        let progress = elapsed / CYCLE_SPEED * 100;
        // this line might bring performance issue
        dispatch({ type: CycleActionTypes.SET_PROGRESS, payload: { progress }});

        ( elapsed <= CYCLE_SPEED )
            ? window.requestAnimationFrame( frame )
            : done()
    }

    function done() {
        start = null
        elapsed = 0
        previous = 0
        dispatch({ type: CycleActionTypes.SET_PROGRESS, payload: { progress: 0 }})
    }

    return {
        frame
    }
}