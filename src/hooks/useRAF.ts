import { CycleActionTypes } from './../contexts/cycleContext';
import { useContext, useState, useEffect, useRef, MutableRefObject } from "react"
import { CycleContext, CycleDispatchContext } from "../contexts/cycleContext"

interface IUseRAF {
    frame: ( timestamp: number ) => void
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
    const [ runn, setRunn ] = useState( false )
    
    const { isPlaying } = useContext( CycleContext )
    const dispatch = useContext( CycleDispatchContext )

    function frame( timestamp: number ) {
        if ( !start.current ) start.current = timestamp;
        // if ( !isPlaying ) previous.current = timestamp - start.current - elapsed.current
        // previous.current = timestamp - start.current - elapsed.current;
        // console.log( isPlaying )
        elapsed.current = timestamp - start.current - previous.current;
        let progress = elapsed.current / CYCLE_SPEED * 100;
        // console.log( progress );
        // console.log( start.current, previous.current, elapsed.current, progress );
        
        // this line might bring performance issue
        // dispatch({ type: CycleActionTypes.SET_PROGRESS, payload: { progress }});

        ( elapsed.current <= CYCLE_SPEED )
            ? window.requestAnimationFrame( frame )
            : done()
    }

    function done() {
        console.log( 'done!' )
        // start = null
        // elapsed = 0
        // previous = 0
        dispatch({ type: CycleActionTypes.SET_PROGRESS, payload: { progress: 0 }})
    }

    useEffect(() => {
        

    }, [ isPlaying ])

    function run() {
        setRunn( true )
    }

    return {
        frame,
        run
    }
}