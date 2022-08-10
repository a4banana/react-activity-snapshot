import { MutableRefObject, useEffect, useRef } from 'react'
import usePrevious from '../../hooks/usePrevious'
import './DayCounter.sass'

interface Prop {
    date: Date
}

export default function DayCounter({ date }: Prop) {
    const day = date.getDate()
    const prev = usePrevious( date )
    const subtract: MutableRefObject<number> = useRef( 0 )
    
    useEffect(() => {
        if ( prev !== date ) {
            const ov = !prev ? new Date() : prev
            subtract.current = Math.ceil( Math.abs( ov.valueOf() - date.valueOf() ) / ( 1000 * 60 * 60 * 24 ))
        }
    }, [ date ])

    return (
        <div className="day-count">
            {/* <div>{ day }</div> */}
        </div>
    )
}