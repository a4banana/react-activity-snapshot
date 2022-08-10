import './DateCounter.sass'
import DayCounter from './DayCounter'
import { InquiryContext } from '../../contexts/inquiryContext'
import { QueuesContext } from '../../contexts/queuesContext'
import { useContext, useEffect, useRef } from 'react'
import type { MutableRefObject } from 'react'

export default function DateCounter() {
    const { data } = useContext( InquiryContext )
    const { cursorDate } = data;
    const currentDate: MutableRefObject<Date> = useRef( new Date() )

    useEffect(() => {
        if ( cursorDate )
            currentDate.current = new Date( cursorDate )

    }, [ cursorDate ])

    const year: number = currentDate.current.getFullYear()
    const month: string = currentDate.current.toLocaleString( 'en-US', { month: 'short' })
    
    return (
        <div className="date-info">
            <h3 className="year">{ year }</h3>
            <h2 className="date">
                <div className="month">{ month }</div>
                <DayCounter date={ currentDate.current } />
            </h2>
        </div>
    )
}