import { ProgressDispatchContext, ProgressActionTypes } from './../contexts/progressContext';
import { useContext, useEffect, useRef, MutableRefObject } from "react"
import { CycleContext, CycleDispatchContext, CycleActionTypes } from "../contexts/cycleContext"

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

export default function useRAF(): IUseRAF {
    const CYCLE_SPEED = 10000
    const start: MutableRefObject<number | null> = useRef( null )
    const elapsed: MutableRefObject<number> = useRef( 0 )
    const previous: MutableRefObject<number> = useRef( 0 )
    const rafId: MutableRefObject<number | null> = useRef( null )
    
    const dispatchProgress = useContext( ProgressDispatchContext )
    const { isPlaying } = useContext( CycleContext )
    const dispatchCycle = useContext( CycleDispatchContext )
    const _isPlaying: MutableRefObject<boolean> = useRef( isPlaying )
    const rafCallbacks: MutableRefObject<RenderingFunctions> = useRef({})

    function done() {
        start.current = 0
        elapsed.current = 0
        previous.current = 0
        // rafId.current = null

        dispatchCycle({ type: CycleActionTypes.LOAD_NEXT_CYCLE })
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
        rafId.current = window.requestAnimationFrame( frame );
        
        if ( elapsed.current > CYCLE_SPEED ) done()

    }

    useEffect(() => {
        rafId.current = window.requestAnimationFrame( frame )
        return () => window.cancelAnimationFrame( rafId.current! )
    }, [])

    useEffect(() => {
        _isPlaying.current = isPlaying
        console.log( _isPlaying.current, isPlaying )
    }, [ isPlaying ])
    
    function addCallback<T>( key: string, fn: RenderingFunction<T> ): void {
        rafCallbacks.current = { ...rafCallbacks.current, ...{ [key]: fn }}
    }

    return {
        addCallback
    }
}