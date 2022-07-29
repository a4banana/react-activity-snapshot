import { ProgressDispatchContext, ProgressActionTypes } from './../contexts/progressContext';
import { CycleActionTypes } from './../contexts/cycleContext';
import { useContext, useState, useEffect, useRef, MutableRefObject } from "react"
import { CycleContext, CycleDispatchContext } from "../contexts/cycleContext"

interface IUseRAF {
    // frame: ( timestamp: number ) => void
    run: () => void
}

/*
    * 'isPlaying' isn't reactivity in frame() function >> isPlaying should be reactivity in frame()
    * dispatch make rerender useRAF() >> only 'frame()' should be re run with RAF
*/

export default function useRAF(): IUseRAF {
    const CYCLE_SPEED = 10000
    const start: MutableRefObject<number | null> = useRef( null )
    const elapsed: MutableRefObject<number> = useRef( 0 )
    const previous: MutableRefObject<number> = useRef( 0 )
    const rafId: MutableRefObject<number | null> = useRef( null )
    
    const { isPlaying } = useContext( CycleContext )
    const dispatch = useContext( ProgressDispatchContext )
    const _isPlaying: MutableRefObject<boolean> = useRef( isPlaying )

    function done() {
        
        start.current = 0
        elapsed.current = 0
        previous.current = 0
        rafId.current = null

        dispatch({ type: ProgressActionTypes.SET_PROGRESS, value: 0 })
    }

    const frame = ( timestamp: number ) => {
        if ( !start.current ) start.current = timestamp
        if ( !_isPlaying.current ) previous.current = timestamp - start.current - elapsed.current;
        elapsed.current = timestamp - start.current - previous.current;
        let progress = elapsed.current / CYCLE_SPEED * 100;

        dispatch({ type: ProgressActionTypes.SET_PROGRESS, value: progress });
        // console.log( progress )
        ( elapsed.current <= CYCLE_SPEED )
            ? rafId.current = window.requestAnimationFrame( frame )
            : done()
    }

    useEffect(() => {
        rafId.current = window.requestAnimationFrame( frame )
        return () => window.cancelAnimationFrame( rafId.current! )
    }, [])

    useEffect(() => {
        _isPlaying.current = isPlaying
    }, [ isPlaying ])

    function run() {
        
    }

    return {
        run
    }
}