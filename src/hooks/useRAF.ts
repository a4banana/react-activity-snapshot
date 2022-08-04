import { ProgressDispatchContext, ProgressActionTypes } from './../contexts/progressContext';
import { CycleActionTypes } from './../contexts/cycleContext';
import { useContext, useState, useEffect, useRef, MutableRefObject, useCallback } from "react"
import { CycleContext, CycleDispatchContext } from "../contexts/cycleContext"

interface RenderingFunction<T = void> {
    ( isPlaying?: boolean ): T
}

type RenderingFunctions<T = void> = {
    [ key: string ]: RenderingFunction<T>
}

interface AddCallback<T = void> {
    ( key: string, fn: RenderingFunction<T> ): void
}

interface IUseRAF {
    addCallback: AddCallback
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
    const dispatchProgress = useContext( ProgressDispatchContext )
    const _isPlaying: MutableRefObject<boolean> = useRef( isPlaying )
    const rafCallbacks: MutableRefObject<RenderingFunctions> = useRef({})

    function done() {
        start.current = 0
        elapsed.current = 0
        previous.current = 0
        rafId.current = null

        dispatchProgress({ type: ProgressActionTypes.SET_PROGRESS, value: 0 })
    }

    const frame = ( timestamp: number ) => {
        if ( !start.current ) start.current = timestamp
        if ( !_isPlaying.current ) previous.current = timestamp - start.current - elapsed.current;
        elapsed.current = timestamp - start.current - previous.current;
        let progress = elapsed.current / CYCLE_SPEED * 100;

        // rendering functions
        Object.values( rafCallbacks.current ).forEach(( fn: RenderingFunction ) => fn( _isPlaying.current ))

        dispatchProgress({ type: ProgressActionTypes.SET_PROGRESS, value: progress });
        rafId.current = window.requestAnimationFrame( frame )
        
        // ( elapsed.current <= CYCLE_SPEED )
        //     ? rafId.current = window.requestAnimationFrame( frame )
        //     : done()
    }

    useEffect(() => {
        rafId.current = window.requestAnimationFrame( frame )
        return () => window.cancelAnimationFrame( rafId.current! )
    }, [])

    useEffect(() => {
        _isPlaying.current = isPlaying
    }, [ isPlaying ])
    
    function addCallback<T>( key: string, fn: RenderingFunction<T> ): void {
        rafCallbacks.current = { ...rafCallbacks.current, ...{ [key]: fn }}
    }

    return {
        addCallback
    }
}