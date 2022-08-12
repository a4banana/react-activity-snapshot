import './DateCounter.sass'
import DayCounter from './DayCounter'
import { InquiryContext } from '../../contexts/inquiryContext'
import { QueuesContext } from '../../contexts/queuesContext'
import { useContext, useEffect, useRef, useState } from 'react'
import type { MutableRefObject } from 'react'

export default function DateCounter() {
    const [ date, setDate ] = useState<Date>( new Date() )
    const { data } = useContext( InquiryContext )
    const { cursorDate } = data;
    const current = new Date( cursorDate )
    const year = date.getFullYear()
    const month = date.toLocaleString( 'en-US', { month: 'short' })

    useEffect(() => {
        if ( cursorDate ) {
            setDate( new Date( cursorDate ))
        }
    }, [ cursorDate ])

    
    
    return (
        <div className="date-info">
            <h3 className="year">{ year }</h3>
            <h2 className="date">
                <div className="month">{ month }</div>
                <DayCounter date={ date } />
            </h2>
        </div>
    )
}