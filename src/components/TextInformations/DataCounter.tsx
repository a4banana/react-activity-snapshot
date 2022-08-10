import './DataCounter.sass'
import { useRef, useLayoutEffect, useState } from 'react'
import type { MutableRefObject } from 'react'
import usePrevious from '../../hooks/usePrevious'
import BezierEasing from 'bezier-easing'

interface Prop {
    value: number
    label: string
    duration: number
}

export default function DataCounter({ value, label, duration }: Prop) {
    const [ val, setVal ] = useState<number>( 0 )
    const easeOutQuint = BezierEasing( 0.11, 0, 0.5, 0 )
    const prev = usePrevious<number>( value )
    const start: MutableRefObject<number> = useRef( 0 )
    const amount: MutableRefObject<number> = useRef( 0 )
    const rafId: MutableRefObject<number> = useRef( 0 )

    useLayoutEffect(() => {
        if ( prev !== undefined && prev !== value ) {
            amount.current = value - prev
            rafId.current = window.requestAnimationFrame( countUpValue )
        }
    }, [ value ])

    const countUpValue = ( timestamp: number ) => {
        if ( !start.current ) start.current = timestamp

        const progress: number = timestamp - start.current
        const ratio: number = progress / duration
        const easeProgerss: number = easeOutQuint( ratio )
        setVal( val => Math.ceil( amount.current * Math.min( easeProgerss, 1 )) + prev! )
        
        if ( progress < duration ) {
            rafId.current = window.requestAnimationFrame( countUpValue )
        } else {
            start.current = 0
            window.cancelAnimationFrame( rafId.current )
        }
    }

    return (
        <div className="data-info">
            <div className="numeric-data">{ val }</div>
            <div className="data-info--label">{ label }</div>
        </div>
    )
}