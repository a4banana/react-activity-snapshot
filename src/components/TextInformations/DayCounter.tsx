import { MutableRefObject, useEffect, useRef, useState } from 'react'
import usePrevious from '../../hooks/usePrevious'
import './DayCounter.sass'
import createDays from '../../utils/CreateDays'

interface Prop {
    date: Date
}

export default function DayCounter({ date }: Prop) {
    const elem: MutableRefObject<HTMLDivElement | null> = useRef( null )
    const [ isActive, setIsActive ] = useState( false )
    const day = date.getDate()
    const prev = usePrevious( date )
    const days: MutableRefObject<Array<string>> = useRef([])
    const classes = [
            'day-screen',
            ( isActive ? 'active' : '' ),
        ].join( ' ' );

    useEffect(() => {
        if ( prev && ( prev !== date )) {
            days.current = createDays( prev, date )
            setIsActive( true )
        }
    }, [ date ])
    
    const dayElems = days.current.map(( d, i ) => <div key={ i }>{ d }</div> )
    
    function transitionEndHandler() {
        setIsActive( false )
        days.current = [ days.current[ days.current.length - 1] ]
    }

    return (
        <div className="day-count">
            <div className={ classes } ref={ elem } onTransitionEnd={ transitionEndHandler }>
                { days.current.length ? dayElems : <div>{ day }</div> }
            </div>
        </div>
    )
}